import type { UserFrame } from "@repo/types"
export default function Page() {
  const user: UserFrame = { id: "hellosa"}
  return <div>{user?.id}</div>;
}

