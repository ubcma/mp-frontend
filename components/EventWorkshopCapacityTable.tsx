'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Workshop } from '@/lib/types/workshop';

interface EventWorkshopCapacityTableProps {
  workshops: Workshop[];
}

export default function EventWorkshopCapacityTable({
  workshops,
}: EventWorkshopCapacityTableProps) {
  if (workshops.length === 0) return null;

  return (
    <Accordion type="single" collapsible defaultValue="workshop-capacity">
      <AccordionItem
        value="workshop-capacity"
        className="rounded-lg border px-4 last:border-b"
      >
        <AccordionTrigger className="py-3 hover:no-underline">
          Workshop capacity
        </AccordionTrigger>
        <AccordionContent className="pb-4">
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Workshop</TableHead>
                  <TableHead className="w-16">Slot</TableHead>
                  <TableHead className="w-32 text-right">Registered</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="[&_tr:last-child]:border-b">
                {workshops.map((workshop) => (
                  <TableRow key={workshop.id}>
                    <TableCell className="whitespace-normal font-medium align-top">
                      {workshop.title}
                    </TableCell>
                    <TableCell className="align-top">{workshop.slot}</TableCell>
                    <TableCell className="text-right align-top tabular-nums">
                      {workshop.registeredCount}/{workshop.capacity}
                      {workshop.isFull ? (
                        <span className="text-muted-foreground"> · full</span>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
