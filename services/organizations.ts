import { LIMIT } from "@/configs/paginationConfig";
import { clerkClient } from "@clerk/nextjs/server";
export const getOrganizationBySlug = async (slug: string) => {
  try {
    const org = await clerkClient().organizations.getOrganization({
      slug,
    });
    return org;
  } catch (error) {
    return null;
  }
};

export const createOrganization = async (params: {
  name: string;
  createdBy: string;
  slug: string;
}) => {
  try {
    const org = await clerkClient().organizations.createOrganization({
      ...params,
    });
    return org;
  } catch (error) {
    return null;
  }
};

export const getOrganizationMembership = async (
  orgId: string,
  query: string,
  currentPage: number
) => {
  try {
    const { data, totalCount } =
      await clerkClient().organizations.getOrganizationMembershipList({
        organizationId: orgId,
        limit: LIMIT,
        offset: (currentPage - 1) * LIMIT,
      });

    const totalPage = Math.ceil(totalCount / LIMIT);
    return {
      data,
      totalPage,
    };
  } catch (error) {
    return {
      data: [],
      totalPage: 0,
    };
  }
};

export const getOrganizations = async (query: string, currentPage: number) => {
  try {
    const { data, totalCount } =
      await clerkClient().organizations.getOrganizationList({
        includeMembersCount: true,
        limit: LIMIT,
        offset: (currentPage - 1) * LIMIT,
        query: query,
      });
    const totalPage = Math.ceil(totalCount / LIMIT);
    return {
      data,
      totalPage,
    };
  } catch (error) {
    return {
      data: [],
      totalPage: 0,
    };
  }
};
export const getOrganizationById = async (id: string) => {
  try {
    return await clerkClient().organizations.getOrganization({
      organizationId: id,
    });
  } catch (error) {
    return null;
  }
};

export const updateOrganizationLogo = async (
  orgId: string,

  userId: string,
  file: File
) => {
  try {
    const org = await clerkClient().organizations.updateOrganizationLogo(
      orgId,
      {
        file,
        uploaderUserId: userId,
      }
    );
    return org;
  } catch (error) {
    return null;
  }
};
export const updateOrganization = async (
  orgId: string,
  name: string,
  slug: string
) => {
  try {
    const org = await clerkClient().organizations.updateOrganization(orgId, {
      name,
      slug,
    });
    return org;
  } catch (error) {
    return null;
  }
};

export const createMemberOrganization = async (
  orgId: string,
  userId: string
) => {
  try {
    const member =
      await clerkClient().organizations.createOrganizationMembership({
        organizationId: orgId,
        userId,
        role: "org:member",
      });
    return member;
  } catch (error) {
    return null;
  }
};