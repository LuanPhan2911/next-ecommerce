import { useRouter } from "@/navigation";
import { useCurrentStaffRole } from "./use-current-staff-role";

export const useRouterWithRole = () => {
  const { isOnlyAdmin, isFarmer } = useCurrentStaffRole();

  const prefixAdmin = isOnlyAdmin ? "admin" : null;
  const prefixFarmer = isFarmer ? "farmer" : null;
  const router = useRouter();

  const push = (route: string) => {
    if (prefixAdmin === null && prefixFarmer === null) {
      return;
    }
    if (isOnlyAdmin) {
      router.push(`/${prefixAdmin}/${route}`);
    }
    if (isFarmer) {
      router.push(`/${prefixFarmer}/${route}`);
    }
  };
  const replace = (route: string) => {
    if (prefixAdmin === null && prefixFarmer === null) {
      return;
    }
    if (isOnlyAdmin) {
      router.replace(`/${prefixAdmin}/${route}`);
    }
    if (isFarmer) {
      router.replace(`/${prefixFarmer}/${route}`);
    }
  };
  return { push, replace };
};