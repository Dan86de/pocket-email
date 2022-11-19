import fs from 'fs';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';

import {
    Mjml,
    MjmlHead,
    MjmlTitle,
    MjmlPreview,
    MjmlBody,
    MjmlSection,
    MjmlColumn,
    MjmlButton,
    MjmlImage,
    MjmlText, MjmlDivider
} from "@faire/mjml-react";

import {render} from 'mjml-react'
import {NextApiRequest, NextApiResponse} from "next";


// components/email/Template.tsx
function Template({ children }: any) {
    return (
        <Mjml>
            <MjmlBody width={500}>
                {/* Custom decorative component */}
                {/*<Hero />*/}
                {/* Content for the email goes here */}
                <MjmlSection backgroundColor="#EFEFEF">
                    <MjmlColumn>
                        {children}
                    </MjmlColumn>
                </MjmlSection>
                {/* Footer stuff, like the unsubscribe link */}
                <MjmlSection>
                    <MjmlColumn>
                        <MjmlText>
                            <a href="{{unsubscribe_url}}">
                                Unsubscribe
                            </a>
                        </MjmlText>
                    </MjmlColumn>
                </MjmlSection>
            </MjmlBody>
        </Mjml>
    )
}


export default async function generateEmail(req: NextApiRequest, res: NextApiResponse) {
    const fileContent = fs.readFileSync('./newsletters/newsletter2.mdx');
    // Prepare the MDX file to be rendered
    const mdx = await serialize(fileContent);
    // Compile into HTML
    const { html, errors } = render(
            <Template>
                <MDXRemote
                    {...mdx}
                    components={{
                        p: MjmlText,
                        h1: (props)=><MjmlText color="red">{props.children}</MjmlText>
                    }}
                />
           </Template>,
        { validationLevel: 'soft' }
    );

    console.log(html)
    // if (errors) {
    //     return res.status(500).json({
    //         errors,
    //     });
    // }
    return res.send(html)
}
