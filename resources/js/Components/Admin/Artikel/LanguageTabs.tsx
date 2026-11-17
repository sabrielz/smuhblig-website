import { AiStatusBadge } from '@/Components/Editor/AiStatusBadge';
import type { TranslationStatus } from '@/Components/Editor/AiStatusBadge';

interface LanguageTabsProps {
    activeTab: 'id' | 'en';
    onChangeTab: (tab: 'id' | 'en') => void;
    enStatus: TranslationStatus;
    isEdit: boolean;
    isMarkingReviewed: boolean;
    onMarkReviewed: () => void;
}

export default function LanguageTabs({
    activeTab,
    onChangeTab,
    enStatus,
    isEdit,
    isMarkingReviewed,
    onMarkReviewed,
}: LanguageTabsProps) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-1 flex items-center gap-1 w-max">
            <button
                type="button"
                onClick={() => onChangeTab('id')}
                className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'id'
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
            >
                Indonesia (ID)
            </button>
            <div className="relative flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => onChangeTab('en')}
                    className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        activeTab === 'en'
                            ? 'bg-primary-600 text-white shadow-sm'
                            : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                    }`}
                >
                    English (EN)
                </button>
                {enStatus && (
                    <div className="ml-1">
                        <AiStatusBadge
                            status={enStatus}
                            onMarkReviewed={isEdit && enStatus === 'ai_translated' ? onMarkReviewed : undefined}
                            isMarkingReviewed={isMarkingReviewed}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
