export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    // check
    return <div>Routine id: {slug}</div>;
}
