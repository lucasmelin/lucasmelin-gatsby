---
date: "2018-02-20"
title: "Performing JOINs on text files"
category: "Programming"
---

Linux comes equipped with a handy utility aptly called JOIN which performs join operations on text files.

Performing an inner join is as simple as running **join file1.txt file2.txt**

Producing an outer join can be a bit more verbose. The following command is an example of an outer join.

**join -t $'\t' -o 0,1.2,2.2 -a 1 -a 2 file1.txt file2.txt**

Let's break that down a bit.

* **-t $'\t'**  the -t indicates to join what character to use as the field-separator. In this example, the leading $ allows us to pass the tab character, instead of just a backslash-escaped t.

* **-o 0,1.2,2.2** specifies the fields to output. In this example, we want the joined field 0, then the second field form file 1, then the second field from file 2.

* **-a 1 -a 2** specifies that we want to join *all* the fields from file 1 and *all* the fields from file 2. 
