Official marks go here.

Only add a logo file once you have written permission to use it. When you
do, open tools/partials.js, find the marquee function, and swap the
marquee__name span for an image, keeping the caption line under it.

  <img class="marquee__logo" src="/assets/logos/pata.svg" alt="PATA" />

The same swap works in the credential rows inside tools/build.js, where
the credrow__mark span can hold an img instead of the initials.
