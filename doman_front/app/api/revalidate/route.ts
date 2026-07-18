import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type RevalidateTarget = {
	path: string;
	type?: "page" | "layout";
};

export async function POST(request: NextRequest) {
	const secret = process.env.REVALIDATE_SECRET;

	if (!secret) {
		return NextResponse.json(
			{ revalidated: false, message: "Revalidation is not configured" },
			{ status: 503 }
		);
	}

	if (request.headers.get("x-revalidate-secret") !== secret) {
		return NextResponse.json(
			{ revalidated: false, message: "Invalid secret" },
			{ status: 401 }
		);
	}

	let targets: RevalidateTarget[];
	try {
		const body = (await request.json()) as { paths?: RevalidateTarget[] };
		targets = Array.isArray(body.paths) ? body.paths : [];
	} catch {
		return NextResponse.json(
			{ revalidated: false, message: "Invalid JSON body" },
			{ status: 400 }
		);
	}

	const revalidated = targets
		.filter((target) => typeof target?.path === "string" && target.path.length > 0)
		.map((target) => {
			revalidatePath(target.path, target.type);
			return target.path;
		});

	return NextResponse.json({ revalidated: true, paths: revalidated, now: Date.now() });
}
