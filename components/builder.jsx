"use client";
import { BuilderComponent, useIsPreviewing } from "@builder.io/react";
import { builder } from "@builder.io/sdk";
import { Builder } from '@builder.io/react'
import { Article } from "../components/notion/builder/article";
import DefaultErrorPage from "next/error";
import "../builder-registry";

// Builder Public API Key set in .env file
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY);

export function RenderBuilderContent({ content, data }) {
  // Call the useIsPreviewing hook to determine if
  // the page is being previewed in Builder
  const isPreviewing = useIsPreviewing();
  // If "content" has a value or the page is being previewed in Builder,
  // render the BuilderComponent with the specified content and model props.
  if (content || isPreviewing) {
    return <BuilderComponent content={content} model="page"  data={data} />;
  }
  // If the "content" is falsy and the page is
  // not being previewed in Builder, render the
  // DefaultErrorPage with a 404.
  return <DefaultErrorPage statusCode={404} />;
}

Builder.registerComponent(Article,{
  name: 'CustomArticle',
  inputs: [
    // 'name' is the name of your prop
    { name: 'page', type: 'object' },
    { name: 'blocks', type: 'object' },
  ],
})