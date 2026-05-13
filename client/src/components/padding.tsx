import React, { useEffect, useState } from 'react';
import { Padding as RinPadding } from "@rin/ui";

export function Padding({ children, className, mode = 'both' }: { children?: React.ReactNode, className?: string, mode?: 'left' | 'right' | 'both' }) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (mode === 'left' || mode === 'right') {
      fetch('https://json.btcctc.com/sidebar.json', { cache: 'no-cache' })
        .then(res => {
          if (!res.ok) throw new Error('Network error');
          return res.json();
        })
        .then(json => setData(json))
        .catch(err => {
          console.error("R2 Data Load Failed:", err);
          setError(true);
        });
    }
  }, [mode]);

  // 渲染左侧逻辑
  const renderLeft = () => {
    // 即使没数据，也返回一个占位 div，避免布局塌陷
    if (!data || !data.leftCard) return <div className="w-full animate-pulse bg-gray-50 rounded-[1.8rem] h-64" />;
    
    return (
      <div className="flex flex-col gap-5 w-full fade-in">
        {/* 这里是你原来的左侧卡片 JSX... */}
        <div className="bg-white rounded-[1.8rem] overflow-hidden shadow-sm border border-gray-100">
           {/* ...内部代码保持不变 */}
           <div className="bg-gradient-to-br from-[#0f766e] to-[#134e4a] p-5 text-center">
              {/* 头像名称等 */}
           </div>
        </div>
      </div>
    );
  };

  // 渲染右侧逻辑
  const renderRight = () => {
    if (!data || !data.latestPosts) return <div className="w-full animate-pulse bg-gray-50 rounded-[1.8rem] h-48" />;
    return (
      <div className="flex flex-col gap-5 w-full text-left fade-in">
         {/* ...推荐阅读 JSX */}
      </div>
    );
  };

  // 关键修改：确保 mode='left' 和 'right' 也能被 RinPadding 包裹
  // 这样能继承 Rin 主题的基础边距和响应式样式
  return (
    <RinPadding className={`${className} ${mode !== 'both' ? 'min-w-[260px]' : ''}`}>
      {mode === 'left' && renderLeft()}
      {mode === 'right' && renderRight()}
      {mode === 'both' && children}
    </RinPadding>
  );
}
