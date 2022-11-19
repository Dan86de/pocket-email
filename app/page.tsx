"use client"

import {Fragment, useCallback, useState} from 'react'
import {
    FaceFrownIcon,
    FaceSmileIcon,
    FireIcon,
    HandThumbUpIcon,
    HeartIcon,
    PaperClipIcon,
    XMarkIcon,
} from '@heroicons/react/20/solid'
import {Listbox, Transition} from '@headlessui/react'
import parse from 'html-react-parser'
import {renderToJSON} from "@faire/mjml-react/dist/src/utils/render-to-json";
import {renderToHTML} from "next/dist/server/render";

const moods = [
    {name: 'Excited', value: 'excited', icon: FireIcon, iconColor: 'text-white', bgColor: 'bg-red-500'},
    {name: 'Loved', value: 'loved', icon: HeartIcon, iconColor: 'text-white', bgColor: 'bg-pink-400'},
    {name: 'Happy', value: 'happy', icon: FaceSmileIcon, iconColor: 'text-white', bgColor: 'bg-green-400'},
    {name: 'Sad', value: 'sad', icon: FaceFrownIcon, iconColor: 'text-white', bgColor: 'bg-yellow-400'},
    {name: 'Thumbsy', value: 'thumbsy', icon: HandThumbUpIcon, iconColor: 'text-white', bgColor: 'bg-blue-500'},
    {name: 'I feel nothing', value: null, icon: XMarkIcon, iconColor: 'text-gray-400', bgColor: 'bg-transparent'},
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function IndexPage() {
    const [selected, setSelected] = useState(moods[5])
    const [value, setValue] = useState<string>()
    const [html, setHtml] = useState<string>()

    const handleSubmit = async (event:any) => {
        event.preventDefault()
        const formData = new FormData(event.target);
        await fetch('/api/generate-email', {body: JSON.stringify({markdown:formData.get('markdown')}), method: 'POST'}).then(response=>response.json()).then(data=> {
            console.log(data)
            setHtml(data.html)
            return
        })
    }

console.log(html)
    return (
        <>
            <div className="container mx-auto max-w-3xl">
                <div className="flex items-start space-x-4">

                    <div className="min-w-0 flex-1">
                        <form className="relative" onSubmit={handleSubmit}>
                            <div
                                className="overflow-hidden rounded-lg border border-gray-300 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                                <label htmlFor="comment" className="sr-only">
                                    Write your markdown
                                </label>
                                <textarea
                                    rows={30}
                                    name="markdown"
                                    id="markdown"
                                    className="block w-full resize-none border-0 py-3 focus:ring-0 sm:text-sm"
                                    placeholder="Write your markdown..."
                                    value={value}
                                    onChange={(value) => setValue(value.currentTarget.value)}
                                />

                                {/* Spacer element to match the height of the toolbar */}
                                <div className="py-2" aria-hidden="true">
                                    {/* Matches height of button in toolbar (1px border + 36px content height) */}
                                    <div className="py-px">
                                        <div className="h-9"/>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
                                <div className="flex items-center space-x-5">
                                    <div className="flex items-center">
                                        <button
                                            type="button"
                                            className="-m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                                        >
                                            <PaperClipIcon className="h-5 w-5" aria-hidden="true"/>
                                            <span className="sr-only">Attach a file</span>
                                        </button>
                                    </div>
                                    <div className="flex items-center">
                                        <Listbox value={selected} onChange={setSelected}>
                                            {({open}) => (
                                                <>
                                                    <Listbox.Label className="sr-only"> Your mood </Listbox.Label>
                                                    <div className="relative">
                                                        <Listbox.Button
                                                            className="relative -m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500">
                          <span className="flex items-center justify-center">
                            {selected.value === null ? (
                                <span>
                                <FaceSmileIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true"/>
                                <span className="sr-only"> Add your mood </span>
                              </span>
                            ) : (
                                <span>
                                <span
                                    className={classNames(
                                        selected.bgColor,
                                        'flex h-8 w-8 items-center justify-center rounded-full'
                                    )}
                                >
                                  <selected.icon className="h-5 w-5 flex-shrink-0 text-white" aria-hidden="true"/>
                                </span>
                                <span className="sr-only">{selected.name}</span>
                              </span>
                            )}
                          </span>
                                                        </Listbox.Button>

                                                        <Transition
                                                            show={open}
                                                            as={Fragment}
                                                            leave="transition ease-in duration-100"
                                                            leaveFrom="opacity-100"
                                                            leaveTo="opacity-0"
                                                        >
                                                            <Listbox.Options
                                                                className="absolute z-10 mt-1 -ml-6 w-60 rounded-lg bg-white py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:ml-auto sm:w-64 sm:text-sm">
                                                                {moods.map((mood) => (
                                                                    <Listbox.Option
                                                                        key={mood.value}
                                                                        className={({active}) =>
                                                                            classNames(
                                                                                active ? 'bg-gray-100' : 'bg-white',
                                                                                'relative cursor-default select-none py-2 px-3'
                                                                            )
                                                                        }
                                                                        value={mood}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            <div
                                                                                className={classNames(
                                                                                    mood.bgColor,
                                                                                    'w-8 h-8 rounded-full flex items-center justify-center'
                                                                                )}
                                                                            >
                                                                                <mood.icon
                                                                                    className={classNames(mood.iconColor, 'flex-shrink-0 h-5 w-5')}
                                                                                    aria-hidden="true"
                                                                                />
                                                                            </div>
                                                                            <span
                                                                                className="ml-3 block truncate font-medium">{mood.name}</span>
                                                                        </div>
                                                                    </Listbox.Option>
                                                                ))}
                                                            </Listbox.Options>
                                                        </Transition>
                                                    </div>
                                                </>
                                            )}
                                        </Listbox>
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    <button
                                        type="submit"
                                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Post
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div>
                {html && <div dangerouslySetInnerHTML={{__html:html}}></div>}
            </div>
        </>
    )
}
