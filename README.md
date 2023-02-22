# Introduction

So far, the application has been hosted on a single VM which does not scale based on the number of connections that we receive. Secondly the VM is exposed directly to the internet as it as an external IP address. In this meetup we will achieve the following goals:

1. Create an Instance Group so that the number of VM's serving the clients can grow/shrink based on demand.
2. Configure Cloud NAT so that the VMs can reach out to the internet to install packages/update without the external IP address.
3. Frontend the VM's with a loadbalancer to load balance across the number of available VMs and to avoid having to configure an external IP address directly on the VM



