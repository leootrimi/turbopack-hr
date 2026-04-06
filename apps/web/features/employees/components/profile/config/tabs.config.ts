import { Role } from "../../../../../config/rbac";

export const TAB_CONFIG = [
  { key: "Activity", roles: ["admin", "manager"] },
  { key: "Team", roles: ["admin", "manager", "employee"] },
  { key: "Time off", roles: ["admin", "manager"] },
  { key: "Documents", roles: ["admin", "manager"] },
  { key: "Reviews", roles: ["admin", "manager"] },
];

export const getVisibleTabs = (role: Role) => {
  return TAB_CONFIG
    .filter((tab) => tab.roles.includes(role))
    .map((tab) => tab.key);
};