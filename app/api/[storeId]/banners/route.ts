import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, {params} : {params: {storeId: string}}) {
    try {
        const userId = auth()
        const body = await req.json()

        const {label, imageUrl} = body
        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        if(!label) {
            return new NextResponse("Nama Banner Harus Diisi", {status: 400});
        }

        if(!imageUrl) {
            return new NextResponse("Image Banner Harus Diisi", {status: 400});
        }

        if(!params.storeId) {
            return new NextResponse("Id Toko Harus Diisi", {status: 400});
        }

        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId) {
            return new NextResponse("Toko Tidak Ditemukan", {status: 403});
        }

        const banner = await db.banner.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId
            }
        })

        return NextResponse.json(banner)
    } catch (error) {
        console.error("[BANNERS_POST]", error);
        return new NextResponse("Internal error", {status: 500});
    }
}

export async function GET(req: Request, {params} : {params: {storeId: string}}) {
    try {
        if(!params.storeId) {
            return new NextResponse("Id Toko Harus Diisi", {status: 400});
        }

        const banner = await db.banner.findMany({
            where: {
                storeId: params.storeId
            }
        })

        return NextResponse.json(banner)
    } catch (error) {
        console.error("[BANNERS_GET]", error);
        return new NextResponse("Internal error", {status: 500});
    }
}