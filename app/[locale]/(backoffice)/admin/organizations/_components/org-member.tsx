"use client";
import { NavPagination } from "@/components/nav-pagination";
import { SearchBar } from "@/components/search-bar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserAvatar } from "@/components/user-avatar";
import { OrganizationMembership } from "@clerk/nextjs/server";
import { useFormatter, useTranslations } from "next-intl";
import { OrgAddMember } from "./org-add-member";
import { Staff } from "@prisma/client";
interface OrgMemberProps {
  data: OrganizationMembership[];
  totalPage: number;
  orgMembers: Staff[];
}
export const OrgMember = ({ data, totalPage, orgMembers }: OrgMemberProps) => {
  const { relativeTime } = useFormatter();
  const t = useTranslations("organizations");
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("tabs.member.title")}</CardTitle>
        <CardDescription>{t("tabs.member.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between md:items-center py-4 md:flex-row flex-col gap-2 items-end">
          <div className="w-[300px]">
            <SearchBar
              placeholder={t("search.member.placeholder")}
              isPagination
            />
          </div>
          <OrgAddMember data={orgMembers} />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>{t("table.thead.name")}</TableHead>
              <TableHead>{t("table.thead.role")}</TableHead>
              <TableHead>{t("table.thead.createdAt")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(({ publicUserData, role, createdAt }) => {
              return (
                <TableRow
                  key={publicUserData?.userId}
                  className="cursor-pointer"
                >
                  <TableCell>
                    <UserAvatar
                      src={publicUserData?.imageUrl}
                      size={"default"}
                      className="rounded-full"
                    />
                  </TableCell>
                  <TableCell>
                    <div>{publicUserData?.firstName}</div>
                    <div>{publicUserData?.identifier}</div>
                  </TableCell>

                  <TableCell>{role}</TableCell>
                  <TableCell>{relativeTime(createdAt)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className="py-4">
          <NavPagination totalPage={totalPage} />
        </div>
      </CardContent>
    </Card>
  );
};