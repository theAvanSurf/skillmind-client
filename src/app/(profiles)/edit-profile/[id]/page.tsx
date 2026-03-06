import EditProfileClient from "@/features/profiles/components/EditProfileClient";

export default async function EditProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <EditProfileClient profileId={id} />;
}
