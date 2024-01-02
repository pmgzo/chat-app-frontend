export default function Page({ params }: { params: { name: string } }) {
	return <div>This is a dynamic routes segment with name {params.name} </div>;
}
