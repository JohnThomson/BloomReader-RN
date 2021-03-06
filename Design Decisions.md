## Book Storage

- The .bloomd files are kept in the App's private storage area. "files/books/"
- A list of books with some metadata is maintained in AsyncStorage
- Thumbnails are extracted at import and kept in "files/thumbs/{book-name}/"

### Storing books in private storage?
In the previous version of BloomReader, books are stored in the public area of on-device storage, so using private storage would be a departure from that.

- Pro
    - We have control over the books free from meddling by the user or other apps and can keep our list up to date. This simplifies all aspects of our book list including thumbnails and audio icons.
    - No extra permissions needed (Although see "Storing books on SD Card" below)
    - This is likely to be consistent with how it would work on iOS
    - When the app is uninstalled, the books are deleted (That may be what the user wants)
- Con
    - Different from the previous version of BR
    - Not directly accessible to users/testers
    - When the app is uninstalled, the books are deleted (That may *not* be what the user wants)

### Storing books on SD Card

In the previous BloomReader, books within a certain folder on the SD Card are included in the library of books available to read. This feature was requested by users because on-device storage tends to be very limited for low-cost devices, and using the SD card greatly expands the size of the library that can be distributed.  

### Books with the same name (extracted from filename) are assumed to be the same book

If the user opens a .bloomd with the same name as a book in the library, the new file replaces the old one and the list entry is updated. This prevents ending up with multiple copies of a book accidentally, but it does mean that you can't have two books with the exact same title.


## Import

### BloomBundle Import

In the previous BloomReader, we were dealing with a bug in unpacking BloomBundles* where the FileDescriptor would mysteriously go bad at random intervals. Our workaround was to keep trying until the unpacking was successful. 

I tried to avoid that pain by brining in an unarchiving library, but it depends on having the archive as a File object, and Android gives us a URI. So what the code does right now is copy the bundle from the URI to our own storage, unpack the bundle there, and delete the bundle. The downside is that during the unpack process, this is bundle is potentially consuming 3 times its own size worth of on-device storage - one copy wherever it came from originally, one archived copy in our storage and one unpacked copy in our storage. (That's assuming the original source of the file is on-device storage). A lot of our users have limited on-device storage and this may present an issue for them. 

Other options would be to 

1. Hold our nose and use the unpack function from the previous BR
2. Research a third method

*Bloombundles are simply tar archives with bloom book and shelf files inside.
