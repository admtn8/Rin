import React, { useEffect, useState } from 'react';
import { Padding as RinPadding } from "@rin/ui";

export function Padding({ children, className, mode = 'both' }: { children?: React.ReactNode, className?: string, mode?: 'left' | 'right' | 'both' }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === 'left' || mode === 'right') {
      setLoading(true);
      fetch('https://json.btcctc.com/sidebar.json', { cache: 'no-cache' })
        .then(res => res.json())
        .then(json => {
          console.log("Fetched Sidebar Data:", json); // 💡 调试用：查看控制台数据结构
          setData(json);
        })
        .catch(err => console.error("R2 Data Load Failed:", err))
        .finally(() => setLoading(false));
    }
  }, [mode]);

  // --- 1. 处理左侧挂件渲染函数 ---
  const renderLeftSidebar = () => {
    // 增加容错：检查数据是否存在
    if (!data || !data.leftCard) return null;

    const getIconUrl = (platform: string) => {
      const p = platform.toLowerCase();
      const iconName = p === 'youtube' ? 'youtube-play' : (p === 'telegram' ? 'telegram-app' : p);
      return `https://img.icons8.com/ios-filled/50/ffffff/${iconName}.png`;
    };

    return (
      <div className="flex flex-col gap-5 w-full">
        {/* 头像卡片 */}
        <div className="bg-white rounded-[1.8rem] overflow-hidden shadow-sm border border-gray-100">
          <div className="bg-gradient-to-br from-[#0f766e] to-[#134e4a] p-5 text-center rounded-b-[1.8rem] overflow-hidden">
            <div className="w-14 h-14 bg-white/20 rounded-full mx-auto mb-3 border border-white/30 overflow-hidden flex items-center justify-center">
              {data.leftCard.avatar && <img src={data.leftCard.avatar} className="w-full h-full object-cover" alt="Avatar" />}
            </div>
            <h3 className="text-white font-bold text-base leading-tight">{data.leftCard.name}</h3>
            <p className="text-teal-100 text-[9px] mt-1 tracking-widest uppercase opacity-80">{data.leftCard.title}</p>

            {data.leftCard.socials && (
              <div className="mt-4 pt-4 border-t border-white/10 flex justify-center gap-3">
                {Object.entries(data.leftCard.socials).map(([platform, link]: [string, any]) => (
                    <a key={platform} href={link} target="_blank" rel="noreferrer" 
                       className="w-8 h-8 bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:-translate-y-1 rounded-full ring-1 ring-white/10 shadow-sm">
                      {platform.toLowerCase() === 'bilibili' ? (
                         <span className="text-white font-black text-[10px]">B</span>
                      ) : (
                        <img src={getIconUrl(platform)} className="w-4 h-4" alt={platform}
                          onError={(e: any) => { e.target.src = 'https://img.icons8.com/ios-filled/50/ffffff/link.png' }}
                        />
                      )}
                    </a>
                ))}
              </div>
            )}
          </div>
          <div className="p-4 bg-white text-left">
            <ul className="space-y-2.5">
              {data.leftCard.services?.map((s: string, i: number) => (
                <li key={i} className="flex items-center text-gray-700 text-[14px] font-bold">
                  <span className="w-3.5 h-3.5 bg-teal-50 text-[#0f766e] rounded-full flex items-center justify-center mr-2 text-[9px]">✓</span> {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 广告位 */}
        {data.ad && (
          <a href={data.ad.link} target="_blank" rel="noreferrer" className="block w-full rounded-[1.8rem] overflow-hidden shadow-sm border border-gray-100 bg-white group transition-all">
            <div className="relative overflow-hidden bg-gray-50">
              <img src={data.ad.imageUrl} className="w-full h-auto block group-hover:scale-105 transition-transform duration-500" alt="Ads" />
            </div>
            <div className="p-3.5 border-t border-gray-50 bg-white">
              <h4 className="text-gray-800 font-bold text-[15px] truncate mb-1">{data.ad.title}</h4>
              <div className="flex items-center justify-between">
                <span className="text-[#0f766e] text-[12px] font-bold bg-teal-50 px-1.5 py-0.5 rounded-md">{data.ad.subtitle}</span>
                <span className="text-gray-300 group-hover:text-[#0f766e] transition-colors text-xs">→</span>
              </div>
            </div>
          </a>
        )}

        {/* 实用工具 */}
        {data.selection && (
          <div className="bg-white rounded-[1.8rem] p-4 border border-gray-100 shadow-sm text-left">
            <h4 className="text-[11px] font-black text-gray-400 mb-3 tracking-widest uppercase flex items-center px-1">
              <span className="w-1 h-1 bg-[#0f766e] mr-2 rounded-full"></span> 实用工具
            </h4>
            <nav className="flex flex-col gap-0.5">
              {data.selection.map((item: any, i: number) => (
                <a key={i} href={item.link} target="_blank" rel="noreferrer" className="flex items-center py-2 px-2 rounded-xl hover:bg-teal-50 text-gray-700 font-bold text-[14px] transition-all">
                  <span className="text-base">{item.emoji}</span> 
                  <span className="ml-3 flex-1 truncate">{item.text}</span>
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    );
  };

  // --- 2. 处理右侧挂件渲染函数 ---
  const renderRightSidebar = () => {
    if (!data || !data.latestPosts) return null;
    return (
      <div className="flex flex-col gap-5 w-full text-left">
        <div className="bg-white rounded-[1.8rem] p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-50">
            <span className="text-lg">🔥</span>
            <h4 className="font-bold text-gray-800 text-[15px]">推荐阅读</h4>
          </div>
          <nav className="flex flex-col">
            {data.latestPosts.map((post: any, i: number) => (
              <a key={i} href={post.url} className="py-3 border-b border-gray-50 last:border-0 flex items-start gap-2 group transition-all">
                <span className="text-gray-300 group-hover:text-[#0f766e] transition-colors mt-0.5">#</span>
                <span className="text-[14px] font-medium text-gray-600 group-hover:text-[#0f766e] group-hover:translate-x-1 transition-all duration-300 line-clamp-1">
                  {post.title}
                </span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    );
  };

  // --- 3. 统一返回布局 ---
  // 💡 关键修改：无论什么模式，都包裹在 RinPadding 中，确保 UI 框架的布局逻辑生效
  return (
    <RinPadding className={className}>
      {mode === 'left' && renderLeftSidebar()}
      {mode === 'right' && renderRightSidebar()}
      {mode === 'both' && children}
    </RinPadding>
  );
}
