FROM gcc:11.2-slim

WORKDIR /app

# Install only necessary packages and clean up
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    g++ \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Create a non-root user
RUN useradd -m runner

# Give appropriate permissions
RUN chown -R runner:runner /app

# Switch to non-root user
USER runner

# Set environment variables for better performance
ENV GCC_COLORS='error=01;31:warning=01;35:note=01;36:caret=01;32:locus=01:quote=01'
ENV CXXFLAGS="-O2 -std=c++17"

CMD ["/bin/bash"]
