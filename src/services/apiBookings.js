import { getToday, omitProperties } from "../utils/helpers";
import supabase from "./supabase";

export async function getBookings({ filter, sortBy }) {
  let query = supabase
    .from("bookings")
    .select(
      "id,created_at,start_date,end_date,num_nights,num_guests,status,total_price, cabins(name) , guests(full_name,email)"
    );

  //FILTER
  if (filter) query = query[filter.method || "eq"](filter.field, filter.value);

  //SORT
  if (sortBy)
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === "asc",
    });
  const { data, error } = await query;

  if (error) {
    console.error(error);
    throw new Error("Unable to fetch bookings");
  }

  return data.map(mapToLocalObject);
}

export async function getBooking(id) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, cabins(*), guests(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking not found");
  }

  return mapToLocalObject(data);
}

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
export async function getBookingsAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    .select("created_at, totalPrice, extrasPrice")
    .gte("created_at", date)
    .lte("created_at", getToday({ end: true }));

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return mapToLocalObject(data);
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    // .select('*')
    .select("*, guests(fullName)")
    .gte("startDate", date)
    .lte("startDate", getToday());

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return mapToLocalObject(data);
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName, nationality, countryFlag)")
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
    )
    .order("created_at");

  // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
  // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
  // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }
  return data;
}

export async function updateBooking(id, obj) {
  const { data, error } = await supabase
    .from("bookings")
    .update(obj)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return mapToLocalObject(data);
}

export async function deleteBooking(id) {
  // REMEMBER RLS POLICIES
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return mapToLocalObject(data);
}

function mapToLocalObject(booking) {
  return {
    ...omitProperties(booking, [
      "start_date",
      "end_date",
      "num_nights",
      "num_guests",
      "cabin_price",
      "extras_price",
      "total_price",
      "has_breakfast",
      "is_paid",
    ]),
    startDate: booking.start_date,
    endDate: booking.end_date,
    numNights: booking.num_nights,
    numGuests: booking.num_guests,
    cabinPrice: booking.cabin_price,
    extrasPrices: booking.extras_price,
    totalPrice: booking.total_price,
    hasBreakfast: booking.has_breakfast,
    isPaid: booking.is_paid,
  };
}
