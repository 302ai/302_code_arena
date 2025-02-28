"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/hooks/global/use-theme";
import { cn } from "@/lib/utils";
import {
  SandpackCodeEditor,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import {
  CircleX,
  FileQuestion,
  LockKeyholeOpen,
  LockKeyhole,
  Fullscreen,
  Minimize2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, memo, useCallback, useState, useEffect } from "react";
import { App } from "../model-pk-interface";
import { SupportedGenType, SupportedType } from "@/stores/slices/form_store";
import { Button } from "@/components/ui/button";

const sharedProps = {
  template: "react-ts",
  customSetup: {
    dependencies: {
      axios: "latest",
      "lucide-react": "latest",
      recharts: "2.9.0",
      "react-resizable-panels": "latest",
      three: "latest",
      "@react-three/fiber": "latest",
      "@react-three/drei": "latest",
      "react-router-dom": "latest",
      "@radix-ui/react-accordion": "^1.2.0",
      "@radix-ui/react-alert-dialog": "^1.1.1",
      "@radix-ui/react-aspect-ratio": "^1.1.0",
      "@radix-ui/react-avatar": "^1.1.0",
      "@radix-ui/react-checkbox": "^1.1.1",
      "@radix-ui/react-collapsible": "^1.1.0",
      "@radix-ui/react-dialog": "^1.1.1",
      "@radix-ui/react-dropdown-menu": "^2.1.1",
      "@radix-ui/react-hover-card": "^1.1.1",
      "@radix-ui/react-label": "^2.1.0",
      "@radix-ui/react-menubar": "^1.1.1",
      "@radix-ui/react-navigation-menu": "^1.2.0",
      "@radix-ui/react-popover": "^1.1.1",
      "@radix-ui/react-progress": "^1.1.0",
      "@radix-ui/react-radio-group": "^1.2.0",
      "@radix-ui/react-select": "^2.1.1",
      "@radix-ui/react-separator": "^1.1.0",
      "@radix-ui/react-slider": "^1.2.0",
      "@radix-ui/react-slot": "^1.1.0",
      "@radix-ui/react-switch": "^1.1.0",
      "@radix-ui/react-tabs": "^1.1.0",
      "@radix-ui/react-toast": "^1.2.1",
      "@radix-ui/react-toggle": "^1.1.0",
      "@radix-ui/react-toggle-group": "^1.1.0",
      "@radix-ui/react-tooltip": "^1.1.2",
      "@radix-ui/react-scroll-area": "^1.1.0",
      "class-variance-authority": "^0.7.0",
      clsx: "^2.1.1",
      "date-fns": "^3.6.0",
      "embla-carousel-react": "^8.1.8",
      "react-day-picker": "^8.10.1",
      "tailwind-merge": "^2.4.0",
      "tailwindcss-animate": "^1.0.7",
      vaul: "^0.9.1",
    },
  },
} as const;

interface AppWrapperProps {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
  placeholder: string;
  app: App;
  type: SupportedGenType;
  label: string;
}

export const AppWrapper = memo(function AppWrapper({
  selectedTab,
  onTabSelect,
  placeholder,
  app,
  type,
  label,
}: AppWrapperProps) {
  const t = useTranslations("modelPk.result");
  const { theme } = useTheme();

  const [isCodeLocked, setIsCodeLocked] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { trimmedCode, status, runCodeResult, result, model } = app;

  const cleanCode = useCallback(() => {
    if (model === "o1-2024-12-17") {
      const codeStart = trimmedCode.search(
        /(import|export|const|let|var|function|class|interface|type)\s/
      );
      return trimmedCode.slice(codeStart);
    }
    return trimmedCode;
  }, [trimmedCode, model]);

  const sandpackFiles = useMemo(() => {
    return {
      "/App.tsx": {
        code: cleanCode(),
      },
    };
  }, [cleanCode]);

  useEffect(() => {
    if (status === "generating") {
      setIsCodeLocked(true);
    }
  }, [status]);

  if (status === "idle") {
    return (
      <div className="flex aspect-square h-full w-full flex-col items-center justify-center gap-y-2 rounded-md border bg-muted text-muted-foreground">
        <FileQuestion className="h-12 w-12" />
        <p className="text-xl">{placeholder}</p>
      </div>
    );
  } else if (status === "failed") {
    return (
      <div className="flex aspect-square h-full w-full flex-col items-center justify-center gap-y-2 rounded-md border bg-muted text-muted-foreground">
        <CircleX className="h-12 w-12" />
        <p className="text-xl">{t("failed")}</p>
      </div>
    );
  }

  return (
    <Tabs
      className={cn(
        "relative flex aspect-square w-full flex-col",
        isFullscreen && "!fixed inset-0 z-50 bg-background"
      )}
      value={selectedTab}
      onValueChange={onTabSelect}
    >
      <span className="absolute left-2 top-2 text-lg text-muted-foreground">
        {label}
      </span>
      <TabsList className="h-auto w-fit self-end rounded-none bg-transparent p-0">
        <TabsTrigger
          className="relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
          value="preview"
          disabled={status !== "success"}
        >
          <span
            className={cn(
              "text-sm font-medium",
              selectedTab === "preview" && "text-primary"
            )}
          >
            {type === SupportedType.html || type === SupportedType.react
              ? t("preview")
              : t("run_code_result")}
          </span>
        </TabsTrigger>
        <TabsTrigger
          className="relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
          value="code"
        >
          <span
            className={cn(
              "text-sm font-medium",
              selectedTab === "code" && "text-primary"
            )}
          >
            {t("code")}
          </span>
        </TabsTrigger>
      </TabsList>
      {status === "success" &&
        (type === SupportedType.python ||
          type === SupportedType["node.js"]) && (
          <TabsContent
            value="preview"
            className="rounded-md border border-border p-2 data-[state=inactive]:hidden"
          >
            <div className="aspect-square whitespace-pre-wrap font-mono">
              {runCodeResult}
            </div>
          </TabsContent>
        )}
      <SandpackProvider
        key={result}
        files={sandpackFiles}
        theme={theme === "dark" ? "dark" : "light"}
        options={{
          bundlerTimeOut: 30000,
          autorun: true,
          externalResources: [
            "https://unpkg.com/@tailwindcss/ui/dist/tailwind-ui.min.css",
          ],
        }}
        {...sharedProps}
      >
        {status === "success" &&
          (type === SupportedType.react || type === SupportedType.html) && (
            <TabsContent
              value="preview"
              forceMount
              className={cn(
                "w-full rounded-md border border-border p-2 data-[state=inactive]:hidden",
                isFullscreen && "!fixed inset-0 z-[51] !m-0 !border-0 !p-0"
              )}
            >
              <SandpackPreview
                key={trimmedCode}
                showNavigator={false}
                showOpenInCodeSandbox={true}
                showRefreshButton={true}
                showRestartButton={false}
                className={cn(
                  "aspect-square w-full",
                  isFullscreen && "!aspect-auto !h-screen"
                )}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className={cn(
                  "absolute right-2 top-12 text-muted-foreground",
                  isFullscreen && "right-4 top-4"
                )}
              >
                {isFullscreen ? <Minimize2 /> : <Fullscreen />}
              </Button>
            </TabsContent>
          )}
        <TabsContent
          value="code"
          forceMount
          className="relative w-full rounded-md border border-border p-2 data-[state=inactive]:hidden"
        >
          <SandpackCodeEditor
            readOnly={isCodeLocked}
            showReadOnly={false}
            showRunButton={false}
            className={`aspect-square w-full ${status === "generating" ? "[&_.cm-scroller]:flex-col-reverse" : ""} overflow-hidden [&_.cm-line]:text-[13px]`}
          />
          <Button
            className="absolute bottom-4 right-4 text-muted-foreground"
            type="button"
            variant="ghost"
            onClick={() => setIsCodeLocked(!isCodeLocked)}
            disabled={status === "generating"}
          >
            {isCodeLocked ? (
              <div className="flex items-center gap-x-2">
                <LockKeyhole />
                {t("lock_code")}
              </div>
            ) : (
              <div className="flex items-center gap-x-2">
                <LockKeyholeOpen />
                {t("unlock_code")}
              </div>
            )}
          </Button>
        </TabsContent>
      </SandpackProvider>
    </Tabs>
  );
});
