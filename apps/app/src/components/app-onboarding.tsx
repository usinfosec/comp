"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@comp/ui/accordion";
import { Badge } from "@comp/ui/badge";
import { Button } from "@comp/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@comp/ui/card";
import { PlusIcon } from "lucide-react";
import { BookOpen, Clock, HelpCircle } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useQueryState } from "nuqs";
import Link from "next/link";

interface FAQ {
	questionKey: string;
	answerKey: string;
}

type Props = {
	title: string;
	description: string;
	cta?: string;
	imageSrcLight: string;
	imageSrcDark: string;
	imageAlt: string;
	faqs?: FAQ[];
	sheetName?: string;
	href?: string;
};

export function AppOnboarding({
	title,
	description,
	cta,
	imageSrcLight,
	imageSrcDark,
	imageAlt,
	faqs,
	sheetName,
	href,
}: Props) {
	const [open, setOpen] = useQueryState(sheetName ?? "sheet");
	const isOpen = Boolean(open);
	const { theme } = useTheme();

	return (
		<Card className="w-full overflow-hidden border">
			<div className="flex flex-col lg:min-h-[600px]">
				<div className="p-6 flex-1">
					<div className="flex flex-col max-h-[500px]">
						<CardHeader className="px-0 flex-none space-y-3">
							<div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-0">
								<div>
									<CardTitle className="text-2xl font-bold flex items-center gap-2">
										{title}
										<Badge
											variant="outline"
											className="text-xs"
										>
											New
										</Badge>
										<Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 self-start sm:self-auto hidden sm:flex sm:flex-shrink-0">
											Recommended
										</Badge>
									</CardTitle>
									<CardDescription className="text-base text-muted-foreground max-w-xl">
										{description}
									</CardDescription>
								</div>
							</div>

							<div className="relative h-1 w-full bg-secondary/50 rounded-full overflow-hidden mt-4">
								<div
									className="h-full bg-primary/80 transition-all"
									style={{ width: "5%" }}
								/>
							</div>
						</CardHeader>

						<CardContent className="px-0 flex-1 overflow-hidden flex flex-col h-full min-h-full pt-6">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
								<div className="flex flex-col">
									<div className="flex items-center gap-2 mb-4">
										<BookOpen className="h-4 w-4 text-primary" />
										<p className="font-medium text-md">
											{"Learn More"}
										</p>
									</div>

									{faqs && faqs.length > 0 && (
										<Accordion
											type="single"
											collapsible
											className="w-full divide-y"
										>
											{faqs.map((faq) => (
												<AccordionItem
													key={faq.questionKey}
													value={faq.questionKey}
													className="border-b-0 px-0"
												>
													<AccordionTrigger className="py-3 hover:bg-muted/30 px-2">
														<div className="flex items-center gap-2 text-left">
															<HelpCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
															<span>
																{
																	faq.questionKey
																}
															</span>
														</div>
													</AccordionTrigger>
													<AccordionContent className="px-2 ml-6 border-l-2 my-2 border-muted">
														{faq.answerKey}
													</AccordionContent>
												</AccordionItem>
											))}
										</Accordion>
									)}

									{cta && (
										<div className="flex mt-4 w-full">
											{href ? (
												<Link href={href}>
													<Button
														variant="default"
														className="flex items-center gap-2 w-full"
													>
														<PlusIcon className="w-4 h-4" />
														{cta}
													</Button>
												</Link>
											) : (
												<Button
													variant="default"
													className="flex items-center gap-2 w-full"
													onClick={() => setOpen("true")}
												>
													<PlusIcon className="w-4 h-4" />
													{cta}
												</Button>
											)}
										</div>
									)}
								</div>

								<div className="hidden flex-col items-center justify-center relative lg:flex">
									<div className="absolute inset-0 bg-gradient-radial from-accent/20 to-transparent opacity-70 rounded-full" />
									<Image
										src={theme === "dark" ? imageSrcDark : imageSrcLight}
										alt={imageAlt}
										height={400}
										width={400}
										quality={100}
										className="relative z-10 drop-shadow-md rounded-lg"
									/>
								</div>
							</div>
						</CardContent>
					</div>
				</div>
			</div>
		</Card>
	);
}
