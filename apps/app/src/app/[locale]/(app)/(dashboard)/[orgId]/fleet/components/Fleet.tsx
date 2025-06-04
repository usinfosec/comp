"use client";

import { createFleetUrlAction } from "@/actions/fleet/create-fleet-url";
import { Button } from "@comp/ui/button";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";

export default function ConnectOsquery() {
	const [ready, setReady] = useState(false);
	const [url, setUrl] = useState<string | null>(null);
	const { orgId } = useParams<{ orgId: string }>();

	const init = useAction(createFleetUrlAction, {
		onSuccess: (data) => {
			setUrl(data.data?.installURL ?? null);
			setReady(true);
		},
		onError: (error) => {
			console.error(error);
		},
	});

	async function handleClick() {
		const os = /Mac/.test(navigator.platform)
			? "mac"
			: /Win/.test(navigator.platform)
				? "win"
				: "linux";

		init.execute({ orgId, os });
	}

	return ready ? (
		<Link href={url!}>Download installer</Link>
	) : (
		<Button onClick={handleClick}>Connect endpoints</Button>
	);
}
