import Image from "next/image"
import Link from "next/link"
import { ArrowRight, type LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { hexToRgba } from "@/lib/utils"

export interface HighlightTag {
    icon: LucideIcon
    text: string
    color: string
}

export interface HighlightCardProps {
    image: string
    heading: string
    subheading: string
    url: string
    highlightTags: HighlightTag[]
    color: string
}

export function HighlightCard({ image, heading, subheading, url, highlightTags, color }: HighlightCardProps) {
    return (
        <Link href={url} className="block group">
            <Card className="relative h-72 w-[24rem] md:h-96 md:w-[40rem] duration-200 shadow-md md:py-8 py-4">

                <div className="absolute inset-0 overflow-hidden rounded-xl">
                    <Image
                        src={image || "/placeholder.svg"}
                        alt={heading}
                        fill
                        className="object-cover group-hover:scale-[102%] transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0" style={{
                        background: `linear-gradient(0deg, ${hexToRgba(color, 1)} 0%, ${hexToRgba(color, 0)} 100%)`,
                    }} />
                </div>

                <div className="relative z-[5] h-full flex flex-col gap-4 justify-end md:px-8 px-4 text-white">
                    <div className="space-y-1">
                        <h3 className="text-xl md:text-2xl font-bold leading-tight">{heading}</h3>
                        <p className="text-xs md:text-md text-background/80">{subheading}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 w-10/12">
                        {highlightTags.map((tag, index) => {
                            const IconComponent = tag.icon
                            return (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs md:text-sm font-medium backdrop-blur-md"
                                    style={{
                                        backgroundColor: `${tag.color}4D`,
                                        border: `1px solid ${tag.color}`,
                                    }}
                                >
                                    <IconComponent size={16} style={{ color: tag.color }} />
                                    <span style={{ color: tag.color }}>{tag.text}</span>
                                </div>
                            )
                        })}
                    </div>

                    <div className="rounded-full bg-white p-3 w-fit h-fit absolute right-4 bottom-0 group-hover:-rotate-45 trasition-transform duration-200 ease-in-out">
                        <ArrowRight size={24} className="text-foreground"/>
                    </div>
                </div>
            </Card>
        </Link>
    )
}
