import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OrganizationMembershipPublicUserData } from "@clerk/nextjs/server";
import { Ellipsis } from "lucide-react";
import { OrgMemberViewProfileButton } from "./org-member-view-profile-button";
import { OrgMemberRemoveButton } from "./org-member-remove-button";
interface OrgMemberActionProps {
  data: OrganizationMembershipPublicUserData | null | undefined;
}
export const OrgMemberAction = ({ data }: OrgMemberActionProps) => {
  if (!data) {
    return null;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis className="h-6 w-6" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <OrgMemberViewProfileButton data={data} />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <OrgMemberRemoveButton data={data} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};