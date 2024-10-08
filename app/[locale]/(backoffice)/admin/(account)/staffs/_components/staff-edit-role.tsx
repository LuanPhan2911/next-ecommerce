"use client";

import { editRole } from "@/actions/staff";
import { DynamicDialog } from "@/components/dialog/dynamic-dialog";
import { Button } from "@/components/ui/button";
import { useDialog } from "@/stores/use-dialog";

import { User } from "@clerk/nextjs/server";
import { StaffRole } from "@prisma/client";

import { Edit } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { StaffSelectRole } from "../../../_components/staff-select-role";

import { useRole } from "@/hooks/use-role";

interface UserSetRoleProps {
  data: User;
  label: string;
}
export const StaffEditRole = ({ data, label }: UserSetRoleProps) => {
  const { onOpen } = useDialog();
  const { isSuperAdmin } = useRole(data.publicMetadata.role as StaffRole);

  return (
    <Button
      className="w-full"
      onClick={(e) => {
        e.stopPropagation();
        onOpen("staff.editRole", {
          user: data,
        });
      }}
      variant={"success"}
      disabled={isSuperAdmin}
    >
      <Edit className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );
};
export const StaffEditRoleDialog = () => {
  const { isOpen, data, type, onClose } = useDialog();
  const t = useTranslations("staffs");
  const isOpenDialog = isOpen && type === "staff.editRole";
  const [isPending, startTransition] = useTransition();
  const [role, setRole] = useState<StaffRole>("admin");

  useEffect(() => {
    if (data.user) {
      const role = data.user.publicMetadata.role as StaffRole;
      setRole(role);
    }
  }, [data]);
  const onSubmit = () => {
    if (!data.user) {
      return;
    }
    const id = data.user.id;
    startTransition(() => {
      editRole(id, role)
        .then(({ message, ok }) => {
          if (ok) {
            toast.success(message);
          } else {
            toast.error(message);
          }
        })
        .catch((error: Error) => {
          toast.error(t("status.failure.editRole"));
        })
        .finally(() => {
          onClose();
        });
    });
  };

  return (
    <DynamicDialog
      isOpen={isOpenDialog}
      title={t("form.editRole.title")}
      description={t("form.editRole.description")}
    >
      <StaffSelectRole
        label={t("schema.role.placeholder")}
        onChange={(value) => {
          setRole(value as StaffRole);
        }}
        value={role}
        disabled={isPending}
        hidden={[StaffRole.superadmin]}
      />

      <div className="flex gap-x-2 justify-end">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button disabled={isPending} onClick={onSubmit}>
          Submit
        </Button>
      </div>
    </DynamicDialog>
  );
};
