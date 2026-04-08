# Seed Data Notes

## Files
- `phones.seed.json` contains 30 phone records with nested image arrays.
- `seed-sources.md` contains the official source pages used for the image URLs.

## Recommended approach in your seed code
1. Create a small seed model that matches the JSON shape.
2. In `DbInitializer`, after roles and admin user, check `if (!context.Phones.Any())`.
3. Read `phones.seed.json` from `API/SeedData`.
4. Deserialize it to a list.
5. Map each seed object to a `Phone` entity.
6. For every nested image, create a `PhoneImage` entity.
7. In code, set `CreatedAt = DateTime.UtcNow` and `IsDeleted = false` for phones and images.
8. Use the JSON `isMain` value to mark the main image.
9. Add the phones to the context and call `SaveChangesAsync()`.

## Important note about the images
These image URLs are good for development/demo seed data.
For a more stable final portfolio version, it is better to re-upload the images to your own Cloudinary account and save the Cloudinary URLs later.
