import fs from 'fs';
import {serialize} from 'next-mdx-remote/serialize';
import {MDXRemote} from 'next-mdx-remote';

import {
    Mjml,
    MjmlAttributes,
    MjmlBody,
    MjmlColumn,
    MjmlHead,
    MjmlPreview, MjmlRaw,
    MjmlSection, MjmlSpacer,
    MjmlText,
    MjmlTitle, MjmlWrapper,MjmlStyle
} from "@faire/mjml-react";

import { render } from "@faire/mjml-react/dist/src/utils/render";

import {MjmlFont} from 'mjml-react'

import {NextApiRequest, NextApiResponse} from "next";


// components/email/Template.tsx
function Template({ children }: any) {
    return (
        <Mjml>
            <MjmlHead>
                <MjmlStyle>

                </MjmlStyle>
                <MjmlFont name="Plus Jakarta Sans"
                         href="https://fonts.googleapis.com/css?family=Plus+Jakarta+Sans"/>
                <MjmlTitle>Test newsletter</MjmlTitle>
                <MjmlAttributes>
                    <MjmlText font-family="Plus Jakarta Sans" font-size="18px" />
                </MjmlAttributes>

                <MjmlPreview>
                </MjmlPreview>
            </MjmlHead>
            <MjmlBody width={686}>
                {/* Custom decorative component */}
                {/*<Hero />*/}
                {/* Content for the email goes here */}
                <MjmlSection>
                    <MjmlColumn>
                        <MjmlText>
                            {children}
                        </MjmlText>
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


// export default async function generateEmail(req: NextApiRequest, res: NextApiResponse) {
//   console.log(JSON.parse(req.body).markdown)
//     return res.send('Ok!')
// }

export default async function generateEmail(req: NextApiRequest, res: NextApiResponse) {
    // const fileContent = fs.readFileSync('./newsletters/newsletter1.mdx');
    // Prepare the MDX file to be rendered
    const { markdown } = JSON.parse(req.body)
    console.log(req.body)
    const mdx = await serialize(markdown); //TODO working on correct typing here
    // Compile into HTML
    const { html, errors } = render(
        <Template>
            <MDXRemote
                {...mdx}
                components={{
                    h1: (props) => <h1 className={'text-red-500 text-3xl font-bold'}>{props.children}</h1>
                }}
            />
        </Template>,
        { validationLevel: 'soft' }
    );

    if (errors.length > 0) {
        return res.status(500).json({
            errors,
        });
    }


    return res.status(200).json({ html: html })
}
