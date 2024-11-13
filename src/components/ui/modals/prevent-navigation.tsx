'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { AlertModal } from '@/components/ui/modals/alert-modal';

type PreventNavigationProps = {
  title?: string;
  message?: string;
  isDirty?: boolean;
  backHref?: string;
  onConfirm?: () => void;
};

export const PreventNavigation = ({
  isDirty = false,
  backHref,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone. All your changes will not be saved.',
}: PreventNavigationProps) => {
  const [leavingPage, setLeavingPage] = useState(false);
  const router = useRouter();

  /**
   * Function that will be called when the user selects `yes` in the confirmation modal,
   * redirected to the selected page.
   */
  const confirmationFn = useRef<() => void>(() => {});

  /**
   * Used to make popstate event trigger when back button is clicked.
   * Without this, the popstate event will not fire because it needs there to be a href to return.
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, document.title, window.location.href);
    }
  }, []);

  useEffect(() => {
    /**
     * Used to prevent navigation when user clicks a navigation `<Link />` or `<a />`.
     * @param e The triggered event.
     */
    let lastClickTime = 0;
    const debounceTime = 300; // milliseconds

    const handleClick = (event: MouseEvent) => {
      const now = Date.now();
      if (now - lastClickTime < debounceTime) return;
      lastClickTime = now;

      let target = event.target as HTMLElement;
      while (target && target.tagName !== 'A') {
        target = target.parentElement as HTMLElement;
      }

      if (target && target.tagName === 'A') {
        const anchorElement = target as HTMLAnchorElement;

        if (
          isDirty &&
          typeof window !== 'undefined' &&
          anchorElement?.href !== window.location.href
        ) {
          window.history.pushState(null, document.title, window.location.href);

          confirmationFn.current = () => {
            if (backHref) {
              router.push(backHref);
            } else {
              router.push(anchorElement?.href);
            }
          };

          setLeavingPage(true);
        }
      }
    };
    /**
     * Used to prevent navigation when using `back` browser buttons.
     */
    const handlePopState = () => {
      if (isDirty && typeof window !== 'undefined') {
        window.history.pushState(null, document.title, window.location.href);

        confirmationFn.current = () => {
          if (backHref) {
            router.push(backHref);
          }
        };

        setLeavingPage(true);
      } else {
        if (typeof window !== 'undefined') window.history.back();
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    if (typeof window !== 'undefined') {
      /* *************************** Open listeners ************************** */
      document.addEventListener('click', handleClick);
      window.addEventListener('popstate', handlePopState);
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    /* ************** Return from useEffect closing listeners ************** */
    return () => {
      if (typeof window !== 'undefined') {
        document.removeEventListener('click', handleClick);
        window.removeEventListener('popstate', handlePopState);
        window.removeEventListener('beforeunload', handleBeforeUnload);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty]);

  return (
    <>
      <AlertModal
        open={leavingPage}
        title={title}
        description={message}
        onCancel={() => {
          setLeavingPage(false);
          confirmationFn.current = () => {};
        }}
        onConfirm={() => {
          confirmationFn.current();
          setLeavingPage(false);

          confirmationFn.current = () => {};
          if (typeof onConfirm === 'function') {
            onConfirm();
          }
          router.refresh();
        }}
      />
    </>
  );
};
