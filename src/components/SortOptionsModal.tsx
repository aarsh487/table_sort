"use client";

import {
  DndContext,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { SortableItem } from "./SortableItem";
import { useState } from "react";
import { Button } from "./ui/button";
import { X, ArrowDown, ArrowUp, SlidersHorizontal } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { SortableKey, SortOption } from "@/app/clientTable/page";


const allSortKeys: SortableKey[] = [
  "name",
  "createdAt",
  "updatedAt",
  "id",
  "status",
];

type Props = {
  sorts: SortOption[];
  setSorts: React.Dispatch<React.SetStateAction<SortOption[]>>;
};

export const SortOptionsModal = ({ sorts, setSorts }: Props) => {
  const [open, setOpen] = useState(false);

  const toggleSortDir = (id: SortableKey) => {
    setSorts((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, direction: s.direction === "asc" ? "desc" : "asc" }
          : s
      )
    );
  };

  const removeSort = (id: SortableKey) => {
    console.log("Removing sort:", id);
    setSorts((prev) => prev.filter((s) => s.id !== id));
  };

  const addSort = (id: SortableKey) => {
    if (!sorts.some((s) => s.id === id)) {
      setSorts((prev) => [...prev, { id, direction: "asc" }]);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sorts.findIndex((s) => s.id === active.id);
    const newIndex = sorts.findIndex((s) => s.id === over.id);
    setSorts((prev) => arrayMove(prev, oldIndex, newIndex));
  };

  const availableSorts = allSortKeys.filter(
    (key) => !sorts.some((s) => s.id === key)
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex gap-2 items-center">
          <SlidersHorizontal className="w-4 h-4" />
          Sort Options
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <h3 className="text-lg font-bold mb-4">Sort Options</h3>

        <DialogTitle style={{ position: 'absolute', width: '1px', height: '1px', margin: '-1px', padding: '0px', border: '0px', clip: 'rect(0 0 0 0)', clipPath: 'inset(50%)', overflow: 'hidden' }}>
        Dialog Title
      </DialogTitle>

        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sorts.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            {sorts.map((sort) => (
              <SortableItem key={sort.id} id={sort.id}>
                <div className="flex justify-between items-center p-2 bg-gray-100 rounded border mb-2">
                  <div className="capitalize font-medium">{sort.id}</div>
                  <div className="flex gap-2 items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleSortDir(sort.id)}
                    >
                      {sort.direction === "asc" ? (
                        <ArrowUp className="w-4 h-4" />
                      ) : (
                        <ArrowDown className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {e.stopPropagation(); removeSort(sort.id)}}

                    >
                      <X className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>

        {availableSorts.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Add Sort By</h4>
            <div className="flex flex-wrap gap-2">
              {availableSorts.map((key) => (
                <Button
                  key={key}
                  variant="secondary"
                  size="sm"
                  onClick={() => addSort(key)}
                >
                  {key}
                </Button>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
