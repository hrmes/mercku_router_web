FROM ubuntu:18.04

# Install dependencies
COPY ./sources.list /etc/apt/sources.list

RUN apt update && apt install -y make
RUN apt install -y curl git
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -

RUN apt install -y nodejs
RUN curl -fsSL https://get.pnpm.io/install.sh | bash -
# RUN npx browserslist@latest --update-db

# RUN apt update && apt install -y make autoconf gcc g++ libtool shtool curl wget valgrind git protobuf-c-compiler pkg-config libprotobuf-c-dev libssl-dev libmbedtls-dev  llvm-dev libclang-dev clang && \
#     rm -rf /var/lib/apt/lists/*
# RUN curl https://sh.rustup.rs -sSf | bash -s -- -y && \
#     echo 'source $HOME/.cargo/env' >> $HOME/.bashrc

# ENV PATH="$HOME/.cargo/bin:$PATH"
# # 注意，这里要使用 <=1.74.0 的版本，使用 rustup install 1.73 && rustup default 1.73 来设置
# RUN $HOME/.cargo/bin/rustup install 1.74 && $HOME/.cargo/bin/rustup default 1.74 && $HOME/.cargo/bin/rustup target add mipsel-unknown-linux-musl && $HOME/.cargo/bin/cargo install bindgen-cli

# RUN curl -o cmake.tar.gz -L https://github.com/Kitware/CMake/releases/download/v3.27.7/cmake-3.27.7.tar.gz && mkdir -p cmake_src && tar zxvf cmake.tar.gz -C cmake_src --strip-components=1 && cd cmake_src && ./bootstrap --prefix=/usr && make -j4 && make install && cd - && rm -rf cmake.tar.gz cmake_src




# #COPY ./mipsel.tar /tmp/toolchain.tar

# RUN curl https://mercku-public.s3.cn-north-1.amazonaws.com.cn/mipsel.tar -o /tmp/toolchain.tar && mkdir -p /usr/local/mipsel && tar xf /tmp/toolchain.tar -C /usr/local/mipsel && rm /tmp/toolchain.tar

# ENV PATH="/usr/local/mipsel/bin:$PATH"

# # COPY ./staging_dir.tar.gz /tmp/staging_dir.tar.gz
# RUN curl https://mercku-public.s3.cn-north-1.amazonaws.com.cn/staging_dir.tar.gz -o /tmp/staging_dir.tar.gz && mkdir -p /usr/local/mipsel/staging_dir && tar xf /tmp/staging_dir.tar.gz -C /usr/local/mipsel/staging_dir && rm /tmp/staging_dir.tar.gz

# ENV STAGING_DIR="/usr/local/mipsel/staging_dir"
# ENV CROSS_COMPILE="mipsel-openwrt-linux-"
# ENV TARGET_PROD="m6a"

# apt install -y 

