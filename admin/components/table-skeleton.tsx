import { Skeleton } from "@/components/ui/skeleton";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";

export function TableSkeleton({ rows = 6, columns }: { rows?: number; columns: number }) {
  return (
    <TableBody>
      {Array.from({ length: rows }, (_, row) => (
        <TableRow key={row} className="hover:bg-transparent">
          {Array.from({ length: columns }, (_, col) => (
            <TableCell key={col}>
              <Skeleton className="h-4 w-full max-w-[160px]" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}
