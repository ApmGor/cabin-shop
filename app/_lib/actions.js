"use server";

import {auth, signIn, signOut} from "@/app/_lib/auth";
import {
  createBooking,
  deleteBooking,
  getBookings,
  updateBooking,
  updateGuest as upGuest
} from "@/app/_lib/data-service";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

export async function updateGuest(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");
  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");
  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("Please provide a valid National ID");
  const updateData = {nationality, countryFlag, nationalID};
  await upGuest(session.user.guestId, updateData);
  revalidatePath("/account/profile");
}

export async function deleteReservation(bookingId) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");
  const guestBookings = (await getBookings(session.user.guestId))
    .filter(booking => booking.id === bookingId);
  if (guestBookings.length === 0) throw new Error("You are not allowed to delete this booking");
  await deleteBooking(bookingId);
  revalidatePath("/account/reservations");
}

export async function updateReservation(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");
  const bookingId = +formData.get("bookingId");
  const guestBookings = (await getBookings(session.user.guestId))
    .filter(booking => booking.id === bookingId);
  if (guestBookings.length === 0) throw new Error("You are not allowed to update this booking");
  const updateData = {
    numGuests: +formData.get("numGuests"),
    observations: formData.get("observations").slice(0,1000)
  }
  await updateBooking(bookingId, updateData);
  revalidatePath(`/account/reservations/edit/${bookingId}`);
  redirect("/account/reservations");
}

export async function createReservation(bookingData, formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");
  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: +formData.get("numGuests"),
    observations: formData.get("observations").slice(0,1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed"
  }
  await createBooking(newBooking);
  revalidatePath(`/cabins/${bookingData.cabinId}`)
  redirect("/cabins/thankyou");
}

export async function signInAction() {
  await signIn("google", {redirectTo: "/account"});
}

export async function signOutAction() {
  await signOut({redirectTo: "/"});
}

