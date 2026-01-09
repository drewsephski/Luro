"use client";

import React from "react";
import { Container } from "@/components";

const Page = () => {
  return (
    <div className="p-6 w-full">
      <Container>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to Luro AI</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            The comprehensive AI tool directory. Browse categories, find tools, and manage your stack.
          </p>
        </div>
      </Container>
    </div>
  );
};

export default Page;
