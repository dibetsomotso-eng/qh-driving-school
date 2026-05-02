'use client';

import { useState } from 'react';
import { collection, query, orderBy, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { type Booking, type BookingStatus } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Loader2, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const STATUS_CONFIG: Record<BookingStatus, { label: string; variant: 'outline' | 'default' | 'destructive' }> = {
  pending:   { label: 'Pending',   variant: 'outline' },
  confirmed: { label: 'Confirmed', variant: 'default' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
};

const TIME_LABELS: Record<string, string> = {
  morning:        'Morning (8am–12pm)',
  afternoon:      'Afternoon (12pm–4pm)',
  'late-afternoon': 'Late Afternoon (4pm–6pm)',
};

type FilterTab = 'all' | 'driving' | 'vehicle';

export default function BookingsDashboard() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const [filter, setFilter] = useState<FilterTab>('all');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);

  const bookingsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'bookings'), orderBy('bookingDate', 'desc'));
  }, [firestore]);

  const { data: bookings, isLoading } = useCollection<Booking>(bookingsQuery);

  const filtered = bookings
    ? filter === 'all'
      ? bookings
      : bookings.filter(b => b.serviceCategory === filter)
    : [];

  const handleStatusChange = (bookingId: string, newStatus: BookingStatus) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'bookings', bookingId);
    setUpdatingStatus(bookingId);
    updateDoc(docRef, { status: newStatus })
      .catch(async () => {
        const permissionError = new FirestorePermissionError({ path: docRef.path, operation: 'update' });
        errorEmitter.emit('permission-error', permissionError);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not update status.' });
      })
      .finally(() => setUpdatingStatus(null));
  };

  const confirmDelete = (bookingId: string) => {
    setBookingToDelete(bookingId);
    setShowDeleteAlert(true);
  };

  const handleDelete = () => {
    if (!firestore || !bookingToDelete) return;
    const docRef = doc(firestore, 'bookings', bookingToDelete);
    setIsDeleting(bookingToDelete);
    deleteDoc(docRef)
      .then(() => {
        toast({ title: 'Success', description: 'Booking deleted.' });
      })
      .catch(async () => {
        const permissionError = new FirestorePermissionError({ path: docRef.path, operation: 'delete' });
        errorEmitter.emit('permission-error', permissionError);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not delete booking.' });
      })
      .finally(() => {
        setIsDeleting(null);
        setBookingToDelete(null);
        setShowDeleteAlert(false);
      });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Bookings</h2>
        <span className="text-sm text-muted-foreground">
          {bookings ? `${bookings.length} total` : ''}
        </span>
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterTab)} className="mb-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="driving">Driving</TabsTrigger>
          <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No bookings found.</p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Preferred Date</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((booking) => {
                const status: BookingStatus = booking.status ?? 'pending';
                const statusConfig = STATUS_CONFIG[status];
                return (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.fullName}</TableCell>
                    <TableCell>
                      <div className="text-sm">{booking.email}</div>
                      <div className="text-xs text-muted-foreground">{booking.phone}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm capitalize">{booking.serviceCategory}</div>
                      <div className="text-xs text-muted-foreground">{booking.licenseType}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{booking.preferredDate}</div>
                      <div className="text-xs text-muted-foreground">{TIME_LABELS[booking.preferredTime] ?? booking.preferredTime}</div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-auto p-0" disabled={updatingStatus === booking.id}>
                            {updatingStatus === booking.id ? (
                              <Loader2 className="h-3 w-3 animate-spin mr-1" />
                            ) : null}
                            <Badge variant={statusConfig.variant} className="cursor-pointer">
                              {statusConfig.label}
                              <ChevronDown className="ml-1 h-3 w-3" />
                            </Badge>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          {(Object.keys(STATUS_CONFIG) as BookingStatus[]).map((s) => (
                            <DropdownMenuItem
                              key={s}
                              onClick={() => handleStatusChange(booking.id!, s)}
                              className={status === s ? 'font-semibold' : ''}
                            >
                              {STATUS_CONFIG[s].label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => confirmDelete(booking.id!)}
                        disabled={isDeleting === booking.id}
                        className="text-destructive hover:text-destructive"
                      >
                        {isDeleting === booking.id
                          ? <Loader2 className="h-4 w-4 animate-spin" />
                          : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The booking record will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
