import { notFound } from "next/navigation";
import { getProduct } from "@/lib/api/server";
import { ProductDetailClient } from "@/components/product-detail-client";
import { LinkButton } from "@/components/ui/link-button";

type Props = { params: Promise<{ id: string }> };

export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  let product: Awaited<ReturnType<typeof getProduct>>;
  try {
    product = await getProduct(id);
  } catch {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
        <p className="text-foreground-muted">Could not load product.</p>
        <LinkButton href="/menu" variant="secondary" className="mt-6">
          Back to menu
        </LinkButton>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
