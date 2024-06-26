import {v4 as uuidv4} from "uuid"
import { currentUser } from "@/lib/auth";
import {NextResponse} from "next/server";
import {db} from "@/lib/db";
import {MemberRole} from "@prisma/client";
import {inviteServer} from "@/actions/invite";

export async function POST(req: Request) {
    try {
        const { name, imageUrl, departmentId } = await req.json();
        const user = await currentUser();

        if (!user || !user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const server = await db.server.create({
            data: {
                userId: user.id,
                name,
                imageUrl,
                departmentId,
                inviteCode: uuidv4(),
                channels: {
                    create: [
                        { name: "general", userId: user.id }
                    ]
                },
                members: {
                    create: [
                        { userId: user.id, role: MemberRole.ADMIN }
                    ]
                }
            }
        });

        inviteServer(server);

        return NextResponse.json(server);
    } catch (error) {
        console.log("[SERVERS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}