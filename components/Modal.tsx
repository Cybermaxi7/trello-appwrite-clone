"use client";

import { useBoardStore } from "@/store/BoardStore";
import { useModalStore } from "@/store/ModalStore";
import { Dialog, Transition } from "@headlessui/react";
import { PhotoIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import { FormEvent, Fragment, useRef } from "react";
import TaskTypeRadioGroup from "./TaskTypeRadioGroup";

export default function Modal() {
    const imagePickerRef = useRef<HTMLInputElement>(null);
    const [isOpen, closeModal] = useModalStore((state) => [
        state.isOpen,
        state.closeModal,
    ]);
    const [addTask, image, setImage, newTaskType, newTaskInput, setNewTaskInput] = useBoardStore(
        (state) => [
            state.addTask,
            state.image,
            state.setImage,
            state.newTaskType,
            state.newTaskInput,
            state.setNewTaskInput,
        ]
    );
    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!newTaskInput) return;

        // Add Task
        addTask(newTaskInput, newTaskType, image)

        setImage(null);
        closeModal();
    }
    return (
        // Use the `Transition` component at the root level
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="form"
                onSubmit={handleSubmit}
                onClose={closeModal}
                className="relative z-10"
            >
                {/*
          Use one Transition.Child to apply one transition to the backdrop...
        */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                {/*
          ...and another Transition.Child to apply a separate transition
          to the contents.
        */}
                <div className="fixed inset-0 overflow-y-auto">
                    <div className=" flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-4 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    className="leading-6 text-lg font-medium pb-2 text-gray-900"
                                    as="h3"
                                >
                                    Add a task
                                </Dialog.Title>

                                {/* ... */}
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        value={newTaskInput}
                                        onChange={(e) =>
                                            setNewTaskInput(e.target.value)
                                        }
                                        placeholder="Enter the task here"
                                        className="w-full border border-gray-300 rounded-md outline-none p-4"
                                    />
                                </div>
                                <TaskTypeRadioGroup />
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            imagePickerRef.current?.click();
                                        }}
                                        className="w-full border border-gray-300 rounded-md outline-none p-4 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                    >
                                        <PhotoIcon className="h-6 w-6 mr-2 inline-block" />
                                        Upload Image
                                    </button>
                                    {image && (
                                        <Image
                                            src={URL.createObjectURL(image)}
                                            alt="uploaded Image"
                                            width={200}
                                            height={200}
                                            className="w-full h-32 object-cover mt-2 filter hover:grayscale transition-all duration-150 cursor-not-allowed"
                                            onClick={() => {
                                                setImage(null);
                                            }}
                                        />
                                    )}
                                    <input
                                        type="file"
                                        ref={imagePickerRef}
                                        hidden
                                        onChange={(e) => {
                                            // Check if e is an image
                                            if (
                                                !e.target.files![0].type?.startsWith(
                                                    "image/"
                                                )
                                            )
                                                return;
                                            setImage(
                                                e.target.files![0] || null
                                            );
                                        }}
                                    />
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        disabled={!newTaskInput}
                                        className="inline-flex justify-center rounded-md border border-transparent  bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
                                    >
                                        Add task
                                    </button>
                                </div>
                            </Dialog.Panel>
                            {/* <div className="fixed inset-0 bg-black bg-opacity-25" /> */}
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
