import React from 'react';
import { cn } from '@/lib/utils';

export interface MiniBarChartData {
    label: string;
    value: number;
}

interface MiniBarChartProps {
    data: MiniBarChartData[];
    height?: number;
    className?: string;
    barColor?: string;
}

export function MiniBarChart({
    data,
    height = 160,
    className,
    barColor = '#003f87',
}: MiniBarChartProps) {
    if (!data || data.length === 0) {
        return (
            <div
                className={cn('flex items-center justify-center text-xs text-neutral-400 p-4 border border-dashed border-neutral-200 rounded-xl', className)}
                style={{ height }}
            >
                Tidak ada data kunjungan untuk ditampilkan
            </div>
        );
    }

    const maxValue = Math.max(...data.map((d) => d.value), 0);
    const chartHeight = height - 40; // ruang untuk label bawah & label atas
    const chartWidth = 100; // viewBox width 100%
    const barWidth = 100 / data.length;

    return (
        <div className={cn('w-full', className)}>
            <div className="flex justify-between items-center text-xs text-neutral-500 mb-2 px-1">
                <span>Nilai Tertinggi: <strong className="text-neutral-800">{maxValue.toLocaleString()}</strong></span>
                <span>Sumbu: 0 s/d {maxValue}</span>
            </div>
            <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full overflow-visible"
                style={{ height: chartHeight }}
                role="img"
                aria-label={`Grafik kunjungan batang. Nilai tertinggi ${maxValue}.`}
            >
                {/* Garis sumbu dasar (nol) */}
                <line
                    x1="0"
                    y1={chartHeight}
                    x2={chartWidth}
                    y2={chartHeight}
                    stroke="#e5e5ea"
                    strokeWidth="1"
                />

                {data.map((item, idx) => {
                    const barH = maxValue > 0 ? (item.value / maxValue) * (chartHeight - 10) : 0;
                    const x = idx * barWidth + barWidth * 0.15;
                    const width = barWidth * 0.7;
                    const y = chartHeight - barH;

                    return (
                        <g key={idx} className="group cursor-pointer">
                            <rect
                                data-testid="chart-bar"
                                x={x}
                                y={y}
                                width={width}
                                height={Math.max(barH, 0)}
                                rx={2}
                                fill={barColor}
                                className="transition-all duration-200 group-hover:opacity-80"
                            >
                                <title>{`${item.label}: ${item.value}`}</title>
                            </rect>
                        </g>
                    );
                })}
            </svg>
            <div className="flex justify-between text-[10px] text-neutral-400 mt-2 px-1">
                <span>{data[0]?.label}</span>
                {data.length > 2 && <span>{data[Math.floor(data.length / 2)]?.label}</span>}
                <span>{data[data.length - 1]?.label}</span>
            </div>
        </div>
    );
}
