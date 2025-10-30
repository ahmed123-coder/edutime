import { AmenitiesTable } from "./_components/amenities-table";

export default function AmenitiesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Amenities Management</h1>
        <p className="text-muted-foreground">
          Manage amenities available for your rooms and spaces.
        </p>
      </div>
      <AmenitiesTable />
    </div>
  );
}