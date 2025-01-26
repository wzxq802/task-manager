import {startCase} from "lodash"
import { OrgControl } from "./_components/org-control";
import { auth } from "@clerk/nextjs/server";

export async function generateMetadata() {
    const authData = await auth();
    const orgSlug = authData.orgSlug || "Organization"; 

    return {
        title: startCase(orgSlug || "Organization")
    }
}

const OrganizationIdLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <OrgControl/>
            {children}
        </>
    )
}

export default OrganizationIdLayout;