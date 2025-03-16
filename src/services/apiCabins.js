import { omitProperties } from "../utils/helpers";
import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }
  return data.map((cabin) => ({
    ...omitProperties(cabin, ["max_capacity", "regular_price"]),
    maxCapacity: cabin.max_capacity,
    regularPrice: cabin.regular_price,
  }));
}

export async function createEditCabin(newCabin, id) {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);
  const imageName = `${Math.random()}-${newCabin.image.name}`.replace("/", "");
  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  //1. Create/Edit cabin
  let query = supabase.from("cabins");

  //A) CREATE
  if (!id)
    query = query.insert([
      {
        ...omitProperties(newCabin, ["maxCapacity", "regularPrice"]),
        max_capacity: newCabin.maxCapacity,
        regular_price: newCabin.regularPrice,
        image: imagePath,
      },
    ]);

  //B) Edit
  if (id)
    query = query
      .update({
        ...omitProperties(newCabin, ["maxCapacity", "regularPrice"]),
        max_capacity: newCabin.maxCapacity,
        regular_price: newCabin.regularPrice,
        image: imagePath,
      })
      .eq("id", id);

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be updated");
  }

  //2. upload image
  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  //3. Delete cabin if ther was an error uploading the image
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.error(storageError);
    throw new Error(
      "Cabin image could not be uploaded and the cabin was not created"
    );
  }
}

export async function deleteCabin(id) {
  const { error } = await supabase.from("cabins").delete().eq("id", id);
  if (error) {
    console.error(error);
    throw new Error("Cabin could not be deleted");
  }
}
