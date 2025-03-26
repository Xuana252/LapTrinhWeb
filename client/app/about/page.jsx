import React from 'react';
import Image from 'next/image';

const ComponentName = () => {
  return (
    <section className="size-full flex flex-col items-center gap-10 p-4">
        <h1 className='text-4xl font-bold text-on-background'>Nhóm 18 SE100.P12</h1>
        <ul className="grid md:grid-cols-4 grid-cols-2 gap-4 w-full max-w-[1000px]">
            <li key={1}  className='flex flex-col items-center gap-2 p-2 w-full bg-surface text-on-surface rounded-lg shadow-lg'>
              <div className='relative h-[70%] w-full'>
                <Image src="/images/LeNguyenDongXuan.jpg" alt="Le Nguyen Dong Xuan" width={300} height={300} className="size-full object-cover" />
              </div>
              <h2 className='font-bold'>Lê Nguyễn Đông Xuân</h2>
              <h2 className='font-semibold'>22521713</h2>
            </li>
            <li key={2} className='flex flex-col items-center gap-2 p-2 w-full bg-surface text-on-surface rounded-lg shadow-lg'>
              <div className='relative h-[70%] w-full'>
                <Image src="/images/LuuNguyenTheVinh.jpg" alt="Luu Nguyen The Vinh" width={300} height={300} className="size-full object-cover" />
              </div>
              <h2 className='font-bold'>Lưu Nguyễn Thế Vinh</h2>
              <h2 className='font-semibold'>22521672</h2>
            </li>
            <li key={3} className='flex flex-col items-center gap-2 p-2 w-full bg-surface text-on-surface rounded-lg shadow-lg'>
              <div className='relative h-[70%] w-full'>
                <Image src="/images/HoMinhTri.jpg" alt="Ho Minh Tri" width={300} height={300} className="size-full object-cover" />
              </div>
              <h2 className='font-bold'>Hồ Minh Trí</h2>
              <h2 className='font-semibold'>22521518</h2>
            </li>
            <li key={4} className='flex flex-col items-center gap-2 p-2 w-full bg-surface text-on-surface rounded-lg shadow-lg'>
              <div className='relative h-[70%] w-full'>
                <Image src="/images/DoanQuangHuy.jpg" alt="Doan Quang Huy" width={300} height={300} className="size-full object-cover" />
              </div>
              <h2 className='font-bold'>Đoàn Quang Huy </h2>
              <h2 className='font-semibold'>22520539</h2>
            </li>
        </ul>

    </section>
  );
};

export default ComponentName;