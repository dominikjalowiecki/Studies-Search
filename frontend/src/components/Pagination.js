import { HStack } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import PaginationButton from './PaginationButton';

export default function Pagination({ setPage, currentPage, pagesCount }) {
  let pagesButtons = [];

  for (
    let i =
      currentPage === 1
        ? 1
        : currentPage === pagesCount
        ? pagesCount - 2
        : currentPage - 1;
    i <=
    (currentPage === 1
      ? 3
      : currentPage === pagesCount
      ? pagesCount
      : currentPage + 1);
    i++
  ) {
    if (i > 0 && i <= pagesCount)
      pagesButtons.push(
        <PaginationButton
          key={i}
          onClick={currentPage === i ? null : () => setPage(i)}
          disabled={currentPage === i ? true : false}
        >
          {i}
        </PaginationButton>
      );
  }

  return (
    <HStack p='1' spacing='1' borderRadius='md'>
      <PaginationButton
        onClick={currentPage === 1 ? null : () => setPage(--currentPage)}
        disabled={currentPage === 1 ? true : false}
      >
        <ChevronLeftIcon boxSize='6' />
        Previous
      </PaginationButton>
      {(currentPage > 2 && currentPage !== pagesCount) || currentPage > 3 ? (
        <>
          <PaginationButton onClick={() => setPage(1)}>1</PaginationButton>
          <span style={{ padding: '0 8px', color: '#999' }}>...</span>
        </>
      ) : (
        ''
      )}

      {pagesButtons}

      {(currentPage < pagesCount - 1 && currentPage !== 1) ||
      currentPage < pagesCount - 2 ? (
        <>
          <span style={{ padding: '0 8px', color: '#999' }}>...</span>
          <PaginationButton onClick={() => setPage(pagesCount)}>
            {pagesCount}
          </PaginationButton>
        </>
      ) : (
        ''
      )}
      <PaginationButton
        onClick={
          currentPage === pagesCount ? null : () => setPage(++currentPage)
        }
        disabled={currentPage === pagesCount ? true : false}
      >
        Next
        <ChevronRightIcon boxSize='6' />
      </PaginationButton>
    </HStack>
  );
}
