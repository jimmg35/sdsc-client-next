'use client';

import { Search as SearchIcon } from 'lucide-react';
import React, { useRef } from 'react';

const Search = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  return (
    <>
      <div className="calcite-box relative w-full h-14">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-gray-500 sm:text-sm">
            <SearchIcon size={18} />
          </span>
        </div>
        <input
          type="text"
          id="locale_modal"
          className="calcite-box calcite-focus h-full block w-full py-1.5 pl-10 pr-20 sm:text-sm sm:leading-6"
          onClick={() => {
            dialogRef.current?.showModal();
          }}
          placeholder="Search for articles!"
        />
      </div>

      <dialog className="rounded-md modal  backdrop-blur-sm" ref={dialogRef}>
        <div className="rounded-md modal-box overflow-hidden p-0 max-w-[800px] top-[125px] absolute">
          {/* <SearchBox />
          <div className="p-8 pt-0 pb-10 max-h-[400px] overflow-auto">
            <Hits hitComponent={Hit} />
          </div> */}
          <p>(Coming soon) Full text search feature</p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button></button>
        </form>
      </dialog>
    </>
  );
};

export default Search;
