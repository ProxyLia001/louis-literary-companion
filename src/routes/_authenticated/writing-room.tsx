import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/writing-room")({
  beforeLoad: () => { throw redirect({ to: "/home" }); },
});
