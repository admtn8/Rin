import React, { useEffect, useState } from 'react';
import { Padding as RinPadding } from "@rin/ui";

export function Padding({ children, className, mode = 'both' }: { children?: React.ReactNode, className?: string, mode?: 'left' | 'right' | 'both' }) {
  const [data, setData] = useState<any>(null);
  const [isClient, setIsClient] = useState(false); // 核心：判断是否在客户端

  // 确保在客户端挂载后再渲染动态内容，完美绕过 SSR Hydration 报错
  useEffect(() => {
    setIsClient(true);
    if (mode === 'left' || mode === 'right') {
      fetch('https://json.btcctc.com/sidebar.json', { cache: 'no-cache' })
        .then(res => res.json())
        .then(json => setData(json))
        .catch(err => console.error("R2 Load Error:", err));
    }
  }, [mode]);

  // 左侧挂件
  const renderLeft = () => {
    // 关键修复：没有数据或 SSR 阶段，必须返回占位骨架，不能 return null
    if (!data || !data.leftCard) {
      return <div className="w-full h-80 bg-gray-100 rounded-[1.8rem] animate-pulse"></div>;
    }

    return (
      <div className="flex flex-col gap-5 w-full">
        <div className="bg-white rounded-[1.8rem] overflow-hidden shadow-sm border border-gray-100">
          <div className="bg-teal-700 p-5 text-center"> {/* 避免使用过于复杂的自定义hex颜色，改用自带类名 */}
            <div className="w-14 h-14 bg-white/20 rounded-full mx-auto mb-3 border border-white/30 overflow-hidden flex items-center justify-center">
              {data.leftCard.avatar && <img src={data.leftCard.avatar} className="w-full h-full object-cover" alt="Avatar" />}
            </div>
            <h3 className="text-white font-bold text-base">{data.leftCard.name}</h3>
            <p className="text-teal-100 text-[10px] mt-1">{data.leftCard.title}</p>
          </div>
          <div className="p-4 bg-white text-left">
            <ul className="space-y-2">
              {data.leftCard.services?.map((s: string, i: number) => (
                <li key={i} className="text-gray-700 text-sm font-bold flex items-center">
                   <span className="mr-2 text-teal-600">✓</span> {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  // 右侧挂件
  const renderRight = () => {
    if (!data || !data.latestPosts) {
      return <div className="w-full h-64 bg-gray-100 rounded-[1.8rem] animate-pulse"></div>;
    }
    return (
      <div className="flex flex-col gap-5 w-full text-left">
        <div className="bg-white rounded-[1.8rem] p-6 shadow-sm border border-gray-100">
          <h4 className="font-bold text-gray-800 text-base mb-4 border-b pb-2">🔥 推荐阅读</h4>
          <nav className="flex flex-col space-y-3">
            {data.latestPosts.map((post: any, i: number) => (
              <a key={i} href={post.url} className="text-sm text-gray-600 hover:text-teal-700 transition-colors">
                # {post.title}
              </a>
            ))}
          </nav>
        </div>
      </div>
    );
  };

  // 如果仅仅是包裹子元素，直接返回原始行为
  if (mode === 'both') {
    return <RinPadding className={className}>{children}</RinPadding>;
  }

  // 最终渲染逻辑
  return (
    <div className={`w-full ${className || ''}`}>
      {!isClient ? (
        // SSR 服务端渲染时，直接输出骨架屏
        <div className="w-full h-64 bg-gray-50 rounded-[1.8rem] animate-pulse"></div>
      ) : (
        // 客户端拿到数据后渲染
        <>
          {mode === 'left' && renderLeft()}
          {mode === 'right' && renderRight()}
        </>
      )}
    </div>
  );
}
