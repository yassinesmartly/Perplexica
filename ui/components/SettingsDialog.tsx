import { cn } from '@/lib/utils';
import { X } from "lucide-react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { RefreshCcw, RefreshCw } from 'lucide-react';
import React, {
  Fragment,
  useEffect,
  useState,
  useTransition,
  type SelectHTMLAttributes,
} from 'react';
import ThemeSwitcher from './theme/Switcher';
import { getUserLocale, setUserLocale } from '@/lib/services';
import { useTranslations } from 'next-intl';
import SharedChats from './SharedChats';
import DeleteAllChats from './DeleteAllChats';
import ArchivedChats from './ArchivedChat';
import ArchiveAllChats from './ArchiveAllChat';
import ExportData from './ExportData';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = ({ className, ...restProps }: InputProps) => {
  return (
    <input
      {...restProps}
      className={cn(
        'bg-white dark:bg-dark-secondary px-3 py-2 flex items-center overflow-hidden border border-light-200 dark:border-dark-200 dark:text-white rounded-lg text-sm',
        className,
      )}
    />
  );
};

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string; disabled?: boolean }[];
}

export const Select = ({ className, options, ...restProps }: SelectProps) => {
  return (
    <select
      {...restProps}
      className={cn(
        'bg-white dark:bg-dark-secondary px-3 py-2 flex items-center overflow-hidden border border-light-200 dark:border-dark-200 dark:text-white rounded-lg text-sm',
        className,
      )}
    >
      {options.map(({ label, value, disabled }) => {
        return (
          <option key={value} value={value} disabled={disabled}>
            {label}
          </option>
        );
      })}
    </select>
  );
};

const SettingsDialog = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchConfig = async () => {
        setIsLoading(true);
        const locale = await getUserLocale();
        setLang(locale)
        setIsLoading(false);
      };


      fetchConfig();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSubmit = async () => {
    setIsUpdating(true);
    setIsUpdating(false);
    setIsOpen(false);

    window.location.reload();
  };

  const langs = [
    {
      value: 'en',
      label: 'English'
    },
    {
      value: 'fr',
      label: 'Français'
    },
    {
      value: 'ar',
      label: 'العربية'
    }
  ];

  const [isPending, startTransition] = useTransition();
  const [lang, setLang] = useState<string>('en');
  const t = useTranslations('Settings');
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') ?? '' : '';

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setIsOpen(false)}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-white/50 dark:bg-black/50" />
        </TransitionChild>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 scale-200"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform rounded-2xl bg-white dark:bg-dark-secondary border border-light-200 dark:border-dark-200 p-6 text-left align-middle shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <DialogTitle className="text-xl font-medium leading-6 dark:text-white">
                  {t("title")}
                </DialogTitle>
              <button
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white mr-1"
                onClick={() => setIsOpen(false)}
              >
                 <X size={20} />
              </button>
              </div>
                {!isLoading && (
                  <div className="flex flex-col space-y-4 mt-6">
                    <div className="flex flex-col space-y-1">
                      <p className="text-black/70 dark:text-white/70 text-sm">
                        {t("Theme")}
                      </p>
                      <ThemeSwitcher />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <p className="text-black/70 dark:text-white/70 text-sm">
                        {t("Language")}
                      </p>
                      <Select
                        value={lang}
                        onChange={(e) => {
                          const locale = e.target.value;
                          startTransition(() => {
                            setUserLocale(locale);
                            setLang(locale);
                          });
                        }}
                        options={langs.map(
                          (lang) => ({
                            value: lang.value,
                            label: lang.label,
                          }),
                        )}
                      />
                    </div>
                    <div className="flex justify-between items-center space-y-1">
                      <p className="text-black/70 dark:text-white/70 text-sm">
                        {t('SharedChats.title')}
                      </p>
                      <SharedChats token={token} />
                    </div>
                    <div className="flex justify-between items-center space-y-1">
                      <p className="text-black/70 dark:text-white/70 text-sm">
                        {t('ArchivedChats.title')}
                      </p>
                      <ArchivedChats token={token} />
                    </div>
                    <div className="flex justify-between items-center space-y-1">
                      <p className="text-black/70 dark:text-white/70 text-sm">
                        Archive all chats
                      </p>
                      <ArchiveAllChats token={token} />
                    </div>
                    <div className="flex justify-between items-center space-y-1">
                      <p className="text-black/70 dark:text-white/70 text-sm">
                        Export Data
                      </p>
                      <ExportData token={token} />
                    </div>
                    <div className="flex justify-between items-center space-y-1">
                      <p className="text-black/70 dark:text-white/70 text-sm">
                        {t('DeleteAllChats.title')}
                      </p>
                      <DeleteAllChats token={token} />
                    </div>
                    {/* {selectedChatModelProvider &&
                      selectedChatModelProvider != 'custom_openai' && (
                        <div className="flex flex-col space-y-1">
                          <p className="text-black/70 dark:text-white/70 text-sm">
                            Chat Model
                          </p>
                          <Select
                            value={selectedChatModel ?? undefined}
                            onChange={(e) =>
                              setSelectedChatModel(e.target.value)
                            }
                            options={(() => {
                              const chatModelProvider =
                                config.chatModelProviders[
                                  selectedChatModelProvider
                                ];

                              return chatModelProvider
                                ? chatModelProvider.length > 0
                                  ? chatModelProvider.map((model) => ({
                                      value: model.name,
                                      label: model.displayName,
                                    }))
                                  : [
                                      {
                                        value: '',
                                        label: 'No models available',
                                        disabled: true,
                                      },
                                    ]
                                : [
                                    {
                                      value: '',
                                      label:
                                        'Invalid provider, please check backend logs',
                                      disabled: true,
                                    },
                                  ];
                            })()}
                          />
                        </div>
                      )} */}
                    {/* {selectedChatModelProvider &&
                      selectedChatModelProvider === 'custom_openai' && (
                        <>
                          <div className="flex flex-col space-y-1">
                            <p className="text-black/70 dark:text-white/70 text-sm">
                              Model name
                            </p>
                            <Input
                              type="text"
                              placeholder="Model name"
                              defaultValue={selectedChatModel!}
                              onChange={(e) =>
                                setSelectedChatModel(e.target.value)
                              }
                            />
                          </div>
                          <div className="flex flex-col space-y-1">
                            <p className="text-black/70 dark:text-white/70 text-sm">
                              Custom OpenAI API Key
                            </p>
                            <Input
                              type="text"
                              placeholder="Custom OpenAI API Key"
                              defaultValue={customOpenAIApiKey!}
                              onChange={(e) =>
                                setCustomOpenAIApiKey(e.target.value)
                              }
                            />
                          </div>
                          <div className="flex flex-col space-y-1">
                            <p className="text-black/70 dark:text-white/70 text-sm">
                              Custom OpenAI Base URL
                            </p>
                            <Input
                              type="text"
                              placeholder="Custom OpenAI Base URL"
                              defaultValue={customOpenAIBaseURL!}
                              onChange={(e) =>
                                setCustomOpenAIBaseURL(e.target.value)
                              }
                            />
                          </div>
                        </>
                      )} */}
                    {/* Embedding models */}
                    {/* {config.embeddingModelProviders && (
                      <div className="flex flex-col space-y-1">
                        <p className="text-black/70 dark:text-white/70 text-sm">
                          Embedding model Provider
                        </p>
                        <Select
                          value={selectedEmbeddingModelProvider ?? undefined}
                          onChange={(e) => {
                            setSelectedEmbeddingModelProvider(e.target.value);
                            setSelectedEmbeddingModel(
                              config.embeddingModelProviders[e.target.value][0]
                                .name,
                            );
                          }}
                          options={Object.keys(
                            config.embeddingModelProviders,
                          ).map((provider) => ({
                            label:
                              provider.charAt(0).toUpperCase() +
                              provider.slice(1),
                            value: provider,
                          }))}
                        />
                      </div>
                    )}
                    {selectedEmbeddingModelProvider && (
                      <div className="flex flex-col space-y-1">
                        <p className="text-black/70 dark:text-white/70 text-sm">
                          Embedding Model
                        </p>
                        <Select
                          value={selectedEmbeddingModel ?? undefined}
                          onChange={(e) =>
                            setSelectedEmbeddingModel(e.target.value)
                          }
                          options={(() => {
                            const embeddingModelProvider =
                              config.embeddingModelProviders[
                              selectedEmbeddingModelProvider
                              ];

                            return embeddingModelProvider
                              ? embeddingModelProvider.length > 0
                                ? embeddingModelProvider.map((model) => ({
                                  label: model.displayName,
                                  value: model.name,
                                }))
                                : [
                                  {
                                    label: 'No embedding models available',
                                    value: '',
                                    disabled: true,
                                  },
                                ]
                              : [
                                {
                                  label:
                                    'Invalid provider, please check backend logs',
                                  value: '',
                                  disabled: true,
                                },
                              ];
                          })()}
                        />
                      </div>
                    )}
                    <div className="flex flex-col space-y-1">
                      <p className="text-black/70 dark:text-white/70 text-sm">
                        OpenAI API Key
                      </p>
                      <Input
                        type="text"
                        placeholder="OpenAI API Key"
                        defaultValue={config.openaiApiKey}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            openaiApiKey: e.target.value,
                          })
                        }
                      />
                    </div> */}
                    {/* <div className="flex flex-col space-y-1">
                      <p className="text-black/70 dark:text-white/70 text-sm">
                        Ollama API URL
                      </p>
                      <Input
                        type="text"
                        placeholder="Ollama API URL"
                        defaultValue={config.ollamaApiUrl}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            ollamaApiUrl: e.target.value,
                          })
                        }
                      />
                    </div> */}
                    {/* <div className="flex flex-col space-y-1">
                      <p className="text-black/70 dark:text-white/70 text-sm">
                        GROQ API Key
                      </p>
                      <Input
                        type="text"
                        placeholder="GROQ API Key"
                        defaultValue={config.groqApiKey}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            groqApiKey: e.target.value,
                          })
                        }
                      />
                    </div> */}
                    {/* <div className="flex flex-col space-y-1">
                      <p className="text-black/70 dark:text-white/70 text-sm">
                        Anthropic API Key
                      </p>
                      <Input
                        type="text"
                        placeholder="Anthropic API key"
                        defaultValue={config.anthropicApiKey}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            anthropicApiKey: e.target.value,
                          })
                        }
                      />
                    </div> */}
                    {/* <div className="flex flex-col space-y-1">
                      <p className="text-black/70 dark:text-white/70 text-sm">
                        Gemini API Key
                      </p>
                      <Input
                        type="text"
                        placeholder="Gemini API key"
                        defaultValue={config.geminiApiKey}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            geminiApiKey: e.target.value,
                          })
                        }
                      />
                    </div> */}
                  </div>
                )}
                {isLoading && (
                  <div className="w-full flex items-center justify-center mt-6 text-black/70 dark:text-white/70 py-6">
                    <RefreshCcw className="animate-spin" />
                  </div>
                )}
                <div className="w-full mt-6 space-y-2">
                  <p className="text-xs text-black/50 dark:text-white/50">
                    {t("desc")}
                  </p>
                  <button
                    onClick={handleSubmit}
                    className="bg-[#24A0ED] flex flex-row items-center space-x-2 text-white disabled:text-white/50 hover:bg-opacity-85 transition duration-100 disabled:bg-[#ececec21] rounded-full px-4 py-2"
                    disabled={isLoading || isUpdating}
                  >
                    {isUpdating ? (
                      <RefreshCw size={20} className="animate-spin" />
                    ) : (
                      <span>{t("Save")}</span>
                    )}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SettingsDialog;
