import { EquipmentTable } from "./_components/equipment-table";

export default function EquipmentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Equipment Management</h1>
        <p className="text-muted-foreground">
          Manage equipment available for your rooms and spaces.
        </p>
      </div>
      <EquipmentTable />
    </div>
  );
}