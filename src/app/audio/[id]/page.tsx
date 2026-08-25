import { redirect } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

/** Deep link / QR: apre la modale sulla home. */
export default async function AudioPage({ params }: Props) {
  const { id } = await params;
  redirect(`/?audio=${encodeURIComponent(id)}`);
}
